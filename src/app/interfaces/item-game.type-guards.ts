import { AlbumItem, ArtistItem, ItemGame, TrackItem } from "./item.interface";

export function isTrackItem(item: ItemGame): item is TrackItem {
  return item.type === 'track';
}

export function isAlbumItem(item: ItemGame): item is AlbumItem {
  return item.type === 'album';
}

export function isArtistItem(item: ItemGame): item is ArtistItem {
  return item.type === 'artist';
}
