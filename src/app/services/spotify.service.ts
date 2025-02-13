import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GameItem } from '../interfaces/item.interface';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private clientId = '8ee07350af9d411b88350ee26451d3c4';
  private clientSecret = '079bb6a533ee46168636812ecfac352a';
  private token: string | null = null;
  private baseUrl = 'https://api.spotify.com/v1/search';

  private apiUrl = 'https://spotify-statistics-and-stream-count.p.rapidapi.com/artist/';
  private jsonPath = 'artists.json'; // Ruta del JSON con los IDs
  private rapidApiKey = '038c2b91ebmsh05077b0b30ecef4p106255jsn79720ebdc11a'; // Reemplázalo con tu clave de RapidAPI

  constructor(private http: HttpClient) {}

  // Leer los IDs desde el JSON
  async getArtistIdsFromJson(): Promise<string[]> {
  try {
    const data = await this.http.get<string[]>(this.jsonPath).toPromise();
    return data ?? []; // Si `data` es undefined, devuelve un array vacío
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return []; // Devuelve un array vacío en caso de error
  }
}


  // Obtener la info de un artista por su ID
async getArtistInfo(artistId: string): Promise<{ name: string; monthlyListeners: number } | null> {
  const headers = new HttpHeaders({
    'X-RapidAPI-Key': this.rapidApiKey,
    'X-RapidAPI-Host': 'spotify-statistics-and-stream-count.p.rapidapi.com'
  });

  try {
    const response: any = await this.http.get(`${this.apiUrl}${artistId}`, { headers }).toPromise();
    
    // Verificamos si la respuesta tiene la información esperada
    if (response && response.name && response.monthlyListeners) {
      return {
        name: response.name,
        monthlyListeners: response.monthlyListeners
      };
    }

    return null;
  } catch (error) {
    console.error(`Error obteniendo datos de ${artistId}:`, error);
    return null;
  }
}

// Obtener la info de todos los artistas del JSON
async getAllArtistsInfo(): Promise<{ name: string; monthlyListeners: number }[]> {
  const artistIds = await this.getArtistIdsFromJson();
  const artistsInfo: { name: string; monthlyListeners: number }[] = [];

  for (const id of artistIds) {
    const info = await this.getArtistInfo(id);
    if (info) {
      artistsInfo.push(info);
    }
  }

  return artistsInfo;
}

// Función que obtiene los datos y los guarda en una variable
async fetchArtistsData(): Promise<void> {
  const artistsData = await this.getAllArtistsInfo();
  console.log("Lista de artistas:", artistsData);
}

  // private artists: string[] = [
  //   "Taylor Swift", "The Weeknd", "Bad Bunny", "Drake", "Billie Eilish",
  //   "Ariana Grande", "Ed Sheeran", "BTS", "Justin Bieber", "Karol G",
  //   "Rauw Alejandro", "J Balvin", "Shakira", "ROSALÍA", "Dua Lipa",
  //   "Post Malone", "Harry Styles", "Doja Cat", "Olivia Rodrigo", "Kanye West",
  //   "Eminem", "Imagine Dragons", "SZA", "Travis Scott", "Rihanna",
  //   "Shawn Mendes", "Maroon 5", "Lil Nas X", "Halsey", "Camila Cabello",
  //   "Selena Gomez", "Lana Del Rey", "Sam Smith", "Daddy Yankee", "Maluma",
  //   "Anuel AA", "Aventura", "Myke Towers", "Ozuna", "Feid",
  //   "Peso Pluma", "Natanael Cano", "Christian Nodal", "Farruko", "Don Omar",
  //   "Maná", "Café Tacvba", "Luis Miguel", "Juan Gabriel", "Vicente Fernández",
  //   "Bruno Mars", "Adele", "Coldplay", "Calvin Harris", "David Guetta",
  //   "Marshmello", "The Chainsmokers", "DJ Snake", "Tiesto", "Martin Garrix",
  //   "Kygo", "Avicii", "Daft Punk", "Blackpink", "NewJeans",
  //   "Stray Kids", "SEVENTEEN", "TWICE", "EXO", "Super Junior",
  //   "KAROL G", "Becky G", "Natti Natasha", "TINI", "Danna Paola",
  //   "Cazzu", "Nicki Nicole", "Bizarrap", "Tiago PZK", "Paulo Londra",
  //   "Morat", "Reik", "Camilo", "Sebastián Yatra", "Manuel Turizo",
  //   "Romeo Santos", "Prince Royce", "CNCO", "Wisin & Yandel", "Gente de Zona",
  //   "Marc Anthony", "Jennifer Lopez", "Ricky Martin", "Chayanne", "Pablo Alborán",
  //   "Alejandro Sanz", "David Bisbal", "Melendi", "Estopa", "La Oreja de Van Gogh"
  // ];

  // constructor(private http: HttpClient) {
  // }

  // // Método para obtener el token si no está disponible
  // async getToken(): Promise<string> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  //   const body = new URLSearchParams();
  //   body.set('grant_type', 'client_credentials');
  //   body.set('client_id', this.clientId);
  //   body.set('client_secret', this.clientSecret);

  //   try {
  //     const response: any = await this.http
  //       .post('https://accounts.spotify.com/api/token', body.toString(), { headers })
  //       .toPromise();
  //     this.token = response.access_token;
  //     console.log(response.access_token)
  //     return this.token ?? '';
  //   } catch (error) {
  //     console.error('Error obteniendo el token:', error);
  //     throw error;
  //   }
  // }

  // // Método para construir la consulta en Spotify
  // buildSpotifyQuery(mood: string, category?: string, selection?: string, limit: number = 25): string {
  //   let queryParts: string[] = [];
  //   let type = "";
  
  //   // Definir el tipo de búsqueda
  //   if (mood === "track") {
  //     type = "track"; // Buscar canciones
  //   } else if (mood === 'album') {
  //     type = "album"; // Buscar álbumes
  //   } else if (mood === "artist") {
  //     type = "artist"; // Buscar artistas
  //   } else {
  //     console.warn("⚠️ Mood no soportado:", mood);
  //     return "";
  //   }
  
  //   // Construcción de consulta basada en categoría
  //   if (selection) {
  //     if (category === "artist") {
  //       queryParts.push(`artist:${selection}`);
  //     } else if (category === "genre") {
  //       queryParts.push(`genre:${selection}`);
  //     } else {
  //       queryParts.push(selection);
  //     }
  //   }
  

  //   if (mood === "album") {
  //     return `https://api.spotify.com/v1/search?q=top NOT podcast NOT audiobook NOT spoken&type=album&limit=${limit}`;
  //   }
    
  
  //   let query = encodeURIComponent(queryParts.join(" "));
  //   return `https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=${limit}`;
  // }
  

  // // Método para hacer la petición a Spotify usando el query
  // async getData(mood: string, category: string, selection: string): Promise<any[]> {
  //   try {
  //     const token = await this.getToken(); // Asegurar que tenemos un token válido
  //     const query = this.buildSpotifyQuery(mood, category, selection);

  //     console.log("query es:", query)

  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${token}`
  //     });
  //     const response: any = await this.http.get(query, { headers }).toPromise();
  //     return this.formatSpotifyData(response, mood);
  //   } catch (error) {
  //     console.error('Error obteniendo datos de Spotify:', error);
  //     return [];
  //   }
  // }

  // private formatSpotifyData(response: any, mood: string): GameItem[] {
  //   if (mood === 'track') {
  //     return response.tracks.items.map((track: any) => ({
  //       name: track.name,
  //       popularityMetric: track.popularity, // No hay playCount en Spotify, usamos `popularity`
  //       imageUrl: track.album.images[0]?.url || ''
  //     }));
  //   }
  //   if (mood === 'album') {
  //     return response.albums.items.map((album: any) => ({
  //       name: album.name,
  //       popularityMetric: album.popularity, // Spotify no da oyentes por álbum, pero usa `popularity`
  //       imageUrl: album.images[0]?.url || ''
  //     }));
  //   }
  //   if (mood === 'artist') {
  //     return response.artists.items.map((artist: any) => ({
  //       name: artist.name,
  //       popularityMetric: artist.followers.total, // Aquí usamos seguidores como métrica
  //       imageUrl: artist.images[0]?.url || ''
  //     }));
  //   }
  //   return [];
  // }

  
// **Ejemplo de uso:**

}
