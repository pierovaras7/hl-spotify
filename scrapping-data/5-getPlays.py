from playwright.sync_api import sync_playwright
import json
import os
import time
import re

# 📌 Carpeta donde están los archivos JSON
JSON_FOLDER = "data-json/"

def load_json(file_path):
    """Carga un archivo JSON si existe, o devuelve una lista vacía si no."""
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)
        except json.JSONDecodeError:
            print(f"⚠️ Error al leer {file_path}, creando uno nuevo.")
            return []
    return []

def save_json(file_path, data):
    """Guarda los datos en el JSON con indentación de 4 espacios."""
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    print(f"✅ Archivo actualizado: {file_path}")

def extract_number(text):
    """Extrae solo los números de un texto como '472.551.083'"""
    numbers = re.findall(r'\d+', text)
    return int("".join(numbers)) if numbers else None

def scrape_plays(page, song_id, retries=3):
    """Extrae el número de reproducciones de una canción en Spotify."""
    url = f"https://open.spotify.com/track/{song_id}"

    for attempt in range(retries):
        try:
            print(f"🔄 Buscando reproducciones para {song_id} (Intento {attempt+1})", flush=True)
            page.goto(url, wait_until="domcontentloaded", timeout=30000)

            selector = "span[data-testid='playcount']"
            page.wait_for_selector(selector, timeout=10000)

            plays_text = page.inner_text(selector)
            plays = extract_number(plays_text)

            if plays:
                print(f"✅ {song_id}: {plays} reproducciones", flush=True)
                return plays
            else:
                raise ValueError(f"❌ No se pudo extraer el número de '{plays_text}'")

        except Exception as e:
            print(f"⚠️ Intento {attempt+1} fallido para {song_id}: {e}", flush=True)
            time.sleep(3)

    print(f"❌ No se pudo obtener reproducciones para {song_id}.", flush=True)
    return None

# 📌 Obtener lista de archivos JSON que comienzan con "tracks-"
json_files = [f for f in os.listdir(JSON_FOLDER) if f.startswith("tracks-") and f.endswith(".json")]

# 📌 Scraping con Playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    for json_file in json_files:
        file_path = os.path.join(JSON_FOLDER, json_file)
        data = load_json(file_path)

        for song in data:
            if "reproducciones" not in song or song["reproducciones"] is None:  # 📌 Verifica si no existe o es null
                song["reproducciones"] = scrape_plays(page, song["id"])
                save_json(file_path, data)  # Guarda después de cada cambio
                time.sleep(1)  # Evita bloqueos

    browser.close()

print("🎉 Todos los archivos han sido procesados.")
