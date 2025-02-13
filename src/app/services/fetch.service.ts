import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlbumItem, ArtistItem, ItemGame, TrackItem } from '../interfaces/item.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  private pathJson: string = "/scrapping-data/data-json/"

  constructor(private http:HttpClient) { }


  fetchJson(nameJson: string, mood: string): Promise<ItemGame[]> {
    return this.http.get<ItemGame[]>(this.pathJson.concat(nameJson)).toPromise()
      .then(data => (data ?? []).map(item => this.mapItem(item, mood)))
      .catch(error => {
        console.error(`❌ Error al obtener el JSON: ${nameJson}`, error);
        return [];
      });
  }
  
  
  mapItem(item: any, mood: string): ItemGame {
    if (mood === 'track') {
      return { ...item, type: 'track' } as TrackItem;
    } 
    if (mood === 'album') {
      return { ...item, type: 'album' } as AlbumItem;
    }
    if (mood === 'artist') {
      return { ...item, type: 'artist' } as ArtistItem;
    }
    console.warn(`⚠️ Item sin tipo definido:`, item);
    return item as ItemGame;
  }
  

}
