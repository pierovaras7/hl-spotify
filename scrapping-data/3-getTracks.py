import requests
import json
import re
import os

# Configurar API
API_URL = "https://spotify23.p.rapidapi.com/playlist_tracks/"
HEADERS = {
    "x-rapidapi-host": "spotify23.p.rapidapi.com",
    "x-rapidapi-key": "038c2b91ebmsh05077b0b30ecef4p106255jsn79720ebdc11a"  # Reemplaza con tu API Key real
}

# Diccionario con géneros y URLs de sus playlists
playlists = {
    "rockEspañol": "https://open.spotify.com/playlist/37i9dQZF1DWYN0zdqzbEwl",
    "rockIngles": "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U",
    "salsa": "https://open.spotify.com/playlist/37i9dQZF1DX7SeoIaFyTmA",
    "reggaeton": "https://open.spotify.com/playlist/37i9dQZF1DWZjqjZMudx9T",
    "popIngles": "https://open.spotify.com/playlist/7LyPXVdCkCvUDoyh5fI7Dh",
    "popEspañol": "https://open.spotify.com/playlist/5i6TPyuopfPKAaamnsLskD",
    "baladas": "https://open.spotify.com/playlist/5YsjA8xAoKTMhfxKToCK0v",
    "hiphop": "https://open.spotify.com/playlist/37i9dQZF1DX186v583rmzp",
    "TaylorSwift": "https://open.spotify.com/playlist/37i9dQZF1DX5KpP2LN299J",
    "BadBunny": "https://open.spotify.com/playlist/37i9dQZF1DX2apWzyECwyZ",
    "LuisMiguel": "https://open.spotify.com/playlist/37i9dQZF1DZ06evO1mfBM4",
    "SodaStereo": "https://open.spotify.com/playlist/37i9dQZF1DZ06evO4uy2je"
}

# Crear carpeta "data-json" si no existe
output_folder = "data-json"
os.makedirs(output_folder, exist_ok=True)

# Función para extraer el ID de la playlist desde la URL
def get_playlist_id(url):
    match = re.search(r"playlist/([a-zA-Z0-9]+)", url)
    return match.group(1) if match else None

# Recorrer las playlists y obtener sus tracks
for genre, url in playlists.items():
    playlist_id = get_playlist_id(url)
    if not playlist_id:
        print(f"⚠️ No se pudo extraer el ID de la playlist: {url}")
        continue

    print(f"📥 Obteniendo datos para {genre}...")

    # Hacer la solicitud a la API
    response = requests.get(API_URL, headers=HEADERS, params={"id": playlist_id, "offset": "0", "limit": "100"})

    # Verificar si la solicitud fue exitosa
    if response.status_code == 200:
        data = response.json()

        # Extraer los tracks relevantes
        tracks = []
        for item in data["items"]:
            track = item["track"]

            imagen_url = track["album"]["images"][0]["url"] if track["album"]["images"] else "No Image Available"

            track_info = {
                "nombre": track["name"],
                "artista": track["artists"][0]["name"],
                "album": track["album"]["name"],
                "imagen_url": imagen_url,
                "id": track["id"]
            }
            tracks.append(track_info)

        # Guardar en la carpeta "data-json"
        filename = os.path.join(output_folder, f"tracks-{genre}.json")
        with open(filename, "w", encoding="utf-8") as output_file:
            json.dump(tracks, output_file, indent=4, ensure_ascii=False)

        print(f"✅ Archivo '{filename}' creado con éxito.")

    else:
        print(f"❌ Error {response.status_code} al obtener {genre}: {response.text}")
