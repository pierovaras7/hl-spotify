import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { Track } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class LastFmService {
  private apiKey = '786f285d85185d05e589989966e79df0';
  private baseUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor(private http: HttpClient, private serviceSpotify: SpotifyService) {
  }

  // ✅ Obtiene las canciones más escuchadas de un artista con paginación
  async getTracks(artist: string, limit: number = 25, page: number = 1): Promise<Track[]> {
    const url = `${this.baseUrl}?method=artist.gettoptracks&artist=${encodeURIComponent(artist)}&api_key=${this.apiKey}&format=json&limit=${limit}&page=${page}`;
  
    const response: any = await this.http.get(url).toPromise();
    return await Promise.all(
      response.toptracks.track.map(async (track: any) => {
        let trackImage = '';
  
        if (!trackImage || trackImage.trim() === '') {
          trackImage = await this.serviceSpotify.getTrackImageFromSpotify(track.name, track.artist.name);
          console.log(trackImage);
        }

        return {
          id: track.name,
          name: track.name,
          artist: track.artist.name,
          playCount: Number(track.playcount),
          image: trackImage
        };
      })
    );
  }
  
}
