import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ItemGame } from '../../interfaces/item.interface';
import { FetchService } from '../../services/fetch.service';
import { isAlbumItem, isArtistItem, isTrackItem } from '../../interfaces/item-game.type-guards';
import { GameOverComponent } from '../game-over/game-over.component';


@Component({
  selector: 'app-game',
  imports: [NgIf, CommonModule, GameOverComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  // Datos del juego
  items: ItemGame[] = [];
  currentItem?: ItemGame;
  nextItem?: ItemGame;
  currentIndex: number = 0;
  loading: boolean = true;

  // Estado del juego
  score: number = 0;
  gameOver: boolean = false;

  // Obtener data del modo de juego
  mood: string = '';
  category: string = '';
  selection: string = '';

  isTrackItem = isTrackItem
  isAlbumItem = isAlbumItem
  isArtistItem = isArtistItem


  constructor(
    private fetchService: FetchService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.url.subscribe(async (segments) => {
      // La URL será algo como: /game/mood/category/selection
      this.mood = segments[1]?.path || ''; 
      this.category = segments[2]?.path || '';
      this.selection = segments[3]?.path || '';

      this.loading = true;
      this.cargarDatos();
      this.loading = false;
    });
  }

  async cargarDatos() {
    const pathJson = this.getPathJson();
    if (!pathJson) {
      console.error('Error: No se encontró un JSON válido para la selección.');
      return;
    }
  
    const data = await this.fetchService.fetchJson(pathJson, this.mood);
  
    this.items = data.map(item => ({
      ...item,
      type: this.mood // Agregar el tipo si no está en el JSON
    })) as ItemGame[];
  
    console.log(this.items);
  
    if (this.items.length > 0) {
      this.currentIndex = 0;
      this.setupRound();
    } else {
      console.error('Error: No se encontraron datos en el JSON.');
    }

    this.loading = false;
  }
  

  getPathJson(): string | null {
    if (this.mood === 'artist') {
      return 'spotify_artists.json';
    } 
    if (this.mood === 'album') {
      return 'spotify_albums.json';
    } 
    return this.getTrackJsonName();
  }
  
  getTrackJsonName(): string | null {
    const trackMappings: { [key: string]: string } = {
      "Salsa": "tracks-salsa.json",
      "Pop en Español": "tracks-popEspañol.json",
      "Pop en Inglés": "tracks-popIngles.json",
      "Rock en Español": "tracks-rockEspañol.json",
      "Rock en Inglés": "tracks-rockIngles.json",
      "Baladas": "tracks-baladas.json",
      "Hip Hop": "tracks-hiphop.json",
      "Reggaeton": "tracks-reggaeton.json",
      "Bad Bunny": "tracks-BadBunny.json",
      "Taylor Swift": "tracks-TaylorSwift.json",
      "Luis Miguel": "tracks-LuisMiguel.json",
      "Soda Stereo": "tracks-SodaStereo.json"
    };
  
    return trackMappings[this.selection] || null;
  }
  


  setupRound(): void {
    if (this.currentIndex >= this.items.length - 1) {
      this.gameOver = true;
      return;
    }
  
    this.currentItem = this.items[this.currentIndex];
    this.nextItem = this.items[this.currentIndex + 1];
  }

  guess(isHigher: boolean) {
    if (!this.currentItem || !this.nextItem) return;
  
    const currentMetric = this.getMetricValue(this.currentItem);
    const nextMetric = this.getMetricValue(this.nextItem);
  
    const correct = isHigher ? nextMetric >= currentMetric : nextMetric < currentMetric;
  
    if (correct) {
      this.score++;
      this.currentIndex++;
  
      if (this.currentIndex < this.items.length - 1) {
        this.setupRound();
      } else {
        this.gameOver = true;
      }
    } else {
      this.gameOver = true;
    }
  }
  

  getMetricLabel(mood: string): string {
    switch (mood) {
      case 'track': return 'Reproducciones';
      case 'album': return 'Popularidad';
      case 'artist': return 'Oyentes mensuales';
      default: return 'Métrica';
    }
  }
  
 
  getMetricValue(item: ItemGame): number {
    if (isTrackItem(item)) return item.reproducciones;
    if (isAlbumItem(item)) return item.popularity;
    if (isArtistItem(item)) return item.listeners;
    return 0;
  }
  
  
  
  
  
  restartGame() {
    this.score = 0;
    this.currentIndex = 0;
    this.gameOver = false;
    this.items = [];
    this.currentItem = undefined;
    this.nextItem = undefined;
    this.loading = true;
  
    this.cargarDatos(); // Vuelve a cargar los datos y reinicia el juego
  }
  
}
