from playwright.sync_api import sync_playwright
import json
import os
import time
import re  # Para limpiar el número de oyentes

# 📌 Ruta del archivo JSON
JSON_FILE = "data-json/spotify_artists.json"

def load_existing_data():
    """Carga el JSON si existe, o devuelve una lista vacía si no."""
    if os.path.exists(JSON_FILE):
        try:
            with open(JSON_FILE, "r", encoding="utf-8") as file:
                return json.load(file)
        except json.JSONDecodeError:
            print("⚠️ Error al leer el JSON, creando uno nuevo.")
            return []
    return []

def save_data(data):
    """Guarda los datos en el JSON con indentación de 4 espacios."""
    with open(JSON_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def extract_number(text):
    """Extrae solo los números de un texto como '95.350.887 oyentes mensuales'"""
    numbers = re.findall(r'\d+', text)  # Encuentra solo números
    return int("".join(numbers)) if numbers else None

def scrape_listeners(page, artist_id, retries=3):
    """Extrae el número de oyentes mensuales con reintentos."""
    url = f"https://open.spotify.com/artist/{artist_id}"

    for attempt in range(retries):
        try:
            print(f"🔄 Intentando obtener oyentes de {artist_id} (Intento {attempt+1})", flush=True)
            page.goto(url, wait_until="domcontentloaded", timeout=30000)  # 30s de espera

            # 🔹 Esperar y extraer el número de oyentes
            selector = "span.Ydwa1P5GkCggtLlSvphs"
            page.wait_for_selector(selector, timeout=10000)  # Esperar hasta 10s

            listeners_text = page.inner_text(selector)
            listeners = extract_number(listeners_text)  # Extraer solo números

            if listeners:
                print(f"✅ {artist_id}: {listeners} oyentes mensuales", flush=True)
                return listeners
            else:
                raise ValueError(f"❌ No se pudo extraer el número de '{listeners_text}'")

        except Exception as e:
            print(f"⚠️ Intento {attempt+1} fallido para {artist_id}: {e}", flush=True)
            time.sleep(3)  # Pausa antes de reintentar

    print(f"❌ No se pudo obtener oyentes para {artist_id}.", flush=True)
    return None  # Devuelve None si no logra obtener los datos

# 📌 Cargar el JSON existente
existing_data = load_existing_data()

# 📌 Scraping con Playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    for artist in existing_data:
        if "listeners" not in artist:  # Solo scrapea si no tiene "listeners"
            artist["listeners"] = scrape_listeners(page, artist["artist_id"])
            save_data(existing_data)  # Guarda después de cada artista
            time.sleep(1)  # Evita bloqueos

    browser.close()

# 📌 Guardar el JSON actualizado con indentación
save_data(existing_data)

print("✅ Todos los datos de oyentes han sido actualizados y guardados en 'spotify_artists.json'", flush=True)

