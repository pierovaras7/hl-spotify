export type ItemGame = TrackItem | AlbumItem | ArtistItem;


export interface TrackItem {
  type: 'track';
  nombre: string,
  artista: string;
  album: string;
  imagen_url: string;
  id: string;
  reproducciones: number;
}

export interface AlbumItem {
  type: 'album';
  album: string;
  album_id: string;
  img_url: string;
  artists: string[];
  popularity: number;
}

export interface ArtistItem  {
  type: 'artist';
  artist: string;
  artist_id: string;
  img_url: string;
  listeners: number;
}
