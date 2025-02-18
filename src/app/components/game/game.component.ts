import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ItemGame } from '../../interfaces/item.interface';
import { FetchService } from '../../services/fetch.service';
import { isAlbumItem, isArtistItem, isTrackItem } from '../../interfaces/item-game.type-guards';
import { GameCardComponent } from '../game-card/game-card.component';
import { GameResultComponent } from '../game-result/game-result.component';
import { trigger, transition, animate, style} from '@angular/animations';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game',
  imports: [NgIf, CommonModule, GameCardComponent, GameResultComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('slideIn', [
      // Entrada (cuando aparece)
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }), // Comienza fuera sin opacidad
        animate('1s ease-out', style({ transform: 'translateY(0)' })) // Baja sin transparencia
      ]),
      // Salida (cuando desaparece)
      transition(':leave', [
        style({ transform: 'translateY(0)' }), // Comienza en su lugar
        animate('1s ease-in', style({ transform: 'translateY(-100%)' })) // Sube sin transparencia
      ])
    ])
    
  ]
})
export class GameComponent implements OnInit {
  
  items: ItemGame[] = [];
  itemLeft?: ItemGame;
  itemRight?: ItemGame;
  currentIndex: number = 0;
  loading: boolean = true;

  // Estado del juego
  score: number = 0;
  gameOver: boolean = false;
  gameWon: boolean = false;
  isAnimating = false;
  showMetricAnother = false;

  // Obtener data del modo de juego
  mood: string = '';
  category: string = '';
  selection: string = '';
  selectedItem: string = ''; 
  staying: boolean = false; 

  clickedLeft = false;
  clickedRight = false;


  constructor(
    private fetchService: FetchService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.url.subscribe(async (segments) => {
      this.mood = segments[1]?.path || ''; 
      this.category = segments[2]?.path || '';
      this.selection = segments[3]?.path || '';

      this.loading = true;
      await this.cargarDatos();
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

      // Desordenar aleatoriamente usando el algoritmo de Fisher-Yates
    this.items = this.shuffleArray(
      data.map(item => ({
        ...item,
        type: this.mood
      })) as ItemGame[]
    );

    if (this.items.length > 0) {
      this.currentIndex = 0;
      this.setupRound();
    } else {
      console.error('Error: No se encontraron datos en el JSON.');
    }

    this.loading = false;
  }

  // Método para desordenar el array
  shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array]; // Clonar el array original para evitar mutaciones
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Intercambio
    }
    return shuffledArray;
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
    console.log(this.selection)
    const trackMappings: { [key: string]: string } = {
      "Salsa": "tracks-salsa.json",
      "Pop en Español": "tracks-popEspañol.json",
      "Pop en Ingles": "tracks-popIngles.json",
      "Rock en Español": "tracks-rockEspañol.json",
      "Rock en Ingles": "tracks-rockIngles.json",
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

    this.itemLeft = this.items[this.currentIndex];
    this.itemRight = this.items[this.currentIndex + 1];
  }

  isItemSelected = false;

  handleGuess(selectedItem: ItemGame): void {
    if (this.gameOver || !this.itemLeft || !this.itemRight) return;

    let stayingItem: ItemGame;
    let exitingItem: ItemGame;

    if (selectedItem === this.itemLeft) {
        stayingItem = this.itemLeft;
        exitingItem = this.itemRight;
        this.selectedItem = 'left';
    } else {
        stayingItem = this.itemRight;
        exitingItem = this.itemLeft;
        this.selectedItem  = 'right';
    }

    let metricStaying = this.getMetricValue(stayingItem);
    let metricExiting = this.getMetricValue(exitingItem);

    this.isItemSelected = true;

    if (metricStaying < metricExiting) {
        this.showMetricAnother = true;
        setTimeout(()=>{
          this.gameOver = true;
          this.selectedItem = '';
          this.showMetricAnother = false;
          this.isItemSelected = false;
        },3000)
        return;
    }

    this.score++;
    this.staying = true;
    this.currentIndex++;

    if (!this.items[this.currentIndex + 1]) {
      this.gameWon = true;
    }

    if (stayingItem === this.itemLeft) {
        this.itemRight = this.items[this.currentIndex + 1] || undefined;
    } else {
        this.itemLeft = this.items[this.currentIndex + 1] || undefined;
    }
    this.isAnimating = true;


    setTimeout(()=>{
      this.staying = false;      
      this.selectedItem = '';
      this.isItemSelected = false;
    },3000)
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
    this.itemLeft = undefined;
    this.itemRight = undefined;

    this.cargarDatos(); 
  }
}
