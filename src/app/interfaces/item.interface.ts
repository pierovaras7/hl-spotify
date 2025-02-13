export interface ItemGame {
  type: 'track' | 'album' | 'artist';
}

export interface TrackItem extends ItemGame {
  type: 'track';
  nombre: string,
  artista: string;
  album: string;
  imagen_url: string;
  id: string;
  reproducciones: number;
}

export interface AlbumItem extends ItemGame {
  type: 'album';
  album: string;
  album_id: string;
  img_url: string;
  artists: string[];
  popularity: number;
}

export interface ArtistItem extends ItemGame {
  type: 'artist';
  artist: string;
  artist_id: string;
  img_url: string;
  listeners: string;
}
