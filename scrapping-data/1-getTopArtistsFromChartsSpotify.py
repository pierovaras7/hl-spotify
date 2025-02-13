import requests
import webbrowser
import urllib.parse
import json
import os
from flask import Flask, request, jsonify

# 🔴 Reemplaza con las credenciales de tu app en Spotify Developer
CLIENT_ID = "8ee07350af9d411b88350ee26451d3c4"
CLIENT_SECRET = "0e3c5ee643d14f14b8f6a1c60c758f4b"
REDIRECT_URI = "http://localhost:5000/callback"

# URLs de Spotify OAuth
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_CHARTS_URL = "https://charts-spotify-com-service.spotify.com/auth/v0/charts/artist-global-weekly/latest"

DATA_FOLDER = "data-json"
os.makedirs(DATA_FOLDER, exist_ok=True)

# 🚀 Iniciar una app Flask para manejar la autenticación
app = Flask(__name__)

@app.route("/")
def login():
    """Redirige al usuario a la página de autorización de Spotify."""
    scope = "user-read-email"  # Puedes agregar más permisos si los necesitas
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": scope,
    }
    auth_url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    webbrowser.open(auth_url)  # Abre la URL en el navegador
    return "Abriendo la página de autenticación de Spotify..."

@app.route("/callback")
def callback():
    """Recibe el código de autorización de Spotify y obtiene el token."""
    code = request.args.get("code")
    if not code:
        return "Error: No se recibió el código de autorización."

    # Solicitar el token de acceso
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }
    response = requests.post(TOKEN_URL, data=data)
    token_info = response.json()

    if "access_token" in token_info:
        access_token = token_info["access_token"]
        return get_spotify_charts(access_token)
    else:
        return jsonify({"error": "Error al obtener el token", "details": token_info})

def get_spotify_charts(token):
    """Usa el token para obtener datos de Spotify Charts y lo imprime."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "app-platform": "Browser",  # 🔴 Requerido para Spotify Charts
    }
    response = requests.get(SPOTIFY_CHARTS_URL, headers=headers)

    if response.status_code == 200:
        data = response.json()

        # ✅ Acceder a "entries" dentro del JSON
        entries = data.get("entries", [])

        # ✅ Transformar los datos al formato deseado
        formatted_entries = [
            {
                "artist": entry["artistMetadata"]["artistName"],
                "artist_id": entry["artistMetadata"]["artistUri"].split(":")[-1],
                "img_url": entry["artistMetadata"].get("displayImageUri", None),
            }
            for entry in entries
        ]

        file_path = os.path.join(DATA_FOLDER, "spotify_artists.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(formatted_entries, f, indent=4, ensure_ascii=False)

        # ✅ Imprimir en consola
        print(json.dumps(formatted_entries, indent=4, ensure_ascii=False))

        # ✅ Devolver JSON formateado en la respuesta
        return jsonify(formatted_entries)# ✅ 
    else:
        return jsonify({"error": "Error al obtener los charts", "details": response.text})

# Iniciar la app Flask
if __name__ == "__main__":
    app.run(port=5000, debug=True)
