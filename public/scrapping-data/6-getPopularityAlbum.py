import requests
import json
import time
import os

# 🔴 Reemplaza con tus credenciales de Spotify Developer
CLIENT_ID = "8ee07350af9d411b88350ee26451d3c4"
CLIENT_SECRET = "0e3c5ee643d14f14b8f6a1c60c758f4b"

# 📂 Archivo JSON de entrada/salida
DATA_FOLDER = "data-json"
JSON_FILE = os.path.join(DATA_FOLDER, "spotify_albums.json")

def get_spotify_token():
    """Obtiene un token de acceso de Spotify usando Client Credentials Flow."""
    url = "https://accounts.spotify.com/api/token"
    data = {"grant_type": "client_credentials"}
    
    # 🔹 Generar la cabecera con la autenticación básica
    headers = {
        "Authorization": requests.auth._basic_auth_str(CLIENT_ID, CLIENT_SECRET),
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        response = requests.post(url, data=data, headers=headers)
        response.raise_for_status()  # Lanza error si la respuesta no es 200
        token_info = response.json()
        return token_info.get("access_token")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error en la solicitud: {e}")
        return None

def get_album_popularity(token, album_id):
    """Obtiene la popularidad de un álbum por su ID."""
    url = f"https://api.spotify.com/v1/albums/{album_id}"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(url, headers=headers)
        album_data = response.json()
        return album_data.get("popularity")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error al obtener datos de {album_id}: {e}")
        return None

# 🚀 Ejecutar el proceso
if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        albums_data = json.load(f)  # Cargar JSON existente

    album_ids = [album["album_id"] for album in albums_data]  # Obtener IDs
    token = get_spotify_token()
    if token:
        for album in albums_data:
            album_id = album["album_id"]
            popularity = get_album_popularity(token, album_id)
                
            print(popularity)


            # 🔄 Agregar popularidad al JSON
            album["popularity"] = popularity

            print(album)

            # 💤 Pausa de 1s entre peticiones para evitar bloqueos
            time.sleep(1)

        # 📂 Guardar el JSON actualizado
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(albums_data, f, indent=4, ensure_ascii=False)

        print(f"✅ Popularidad agregada y guardada en {JSON_FILE}")

    else:
        print("❌ No se pudo obtener el token de acceso.")
else:
    print("❌ El archivo JSON no existe.")
