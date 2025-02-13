import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlbumItem, ArtistItem, ItemGame, TrackItem } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  private pathJson: string = "/scrapping-data/data-json/"

  constructor(private http:HttpClient) { }

  fetchJson(nameJson: string){
    this.http.get<ItemGame[]>(this.pathJson.concat(nameJson)).subscribe((data) => {
      return data.map((item) => this.mapItem(item));
    });
  }

  private mapItem(item: any): ItemGame {
    switch (item.type) {
      case 'track':
        return item as TrackItem;
      case 'album':
        return item as AlbumItem;
      case 'artist':
        return item as ArtistItem;
      default:
        throw new Error('Tipo de item desconocido');
    }
  }

}
