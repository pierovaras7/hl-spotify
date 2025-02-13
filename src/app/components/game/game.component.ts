import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ItemGame } from '../../interfaces/item.interface';
import { FetchService } from '../../services/fetch.service';

@Component({
  selector: 'app-game',
  imports: [NgIf, CommonModule],
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
  page: number = 1;
  fetchingMoreItems: boolean = false;

  // Estado del juego
  score: number = 0;
  gameOver: boolean = false;

  // Obtener data del modo de juego
  mood: string = '';
  category: string = '';
  selection: string = '';

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
      this.loading = false;
    });
  }

  // async loadItems() {
  //   if (this.fetchingMoreItems) return;
  //   this.fetchingMoreItems = true;

  //   try {
  //     const newItems = await this.spotifyServ.getData(this.mood, this.category ,this.selection);
  //     console.log(newItems)
      
  //     if (newItems.length > 0) {
  //       this.items.push(...newItems);
  //       this.page++; // Aumentar página para cargar más

  //       if (!this.currentItem) {
  //         this.setupRound();
  //       }
  //     } else {
  //       console.error("No se pudieron cargar más datos.");
  //       this.gameOver = true;
  //     }

  //     this.spotifyServ.crearIDS();
  //   } catch (error) {
  //     console.error("Error cargando datos de Spotify:", error);
  //     this.gameOver = true;
  //   }

  //   this.fetchingMoreItems = false;
  // }

  setupRound(): void {
    if (this.currentIndex >= this.items.length - 1) {
      // this.loadItems();
      return;
    }

    this.currentItem = this.items[this.currentIndex];
    this.nextItem = this.items[this.currentIndex + 1];
  }

  // async guess(isHigher: boolean) {
  //   if (!this.currentItem || !this.nextItem) return;

  //   const correct = isHigher 
  //     ? this.nextItem.popularityMetric >= this.currentItem.popularityMetric
  //     : this.nextItem.popularityMetric < this.currentItem.popularityMetric;
    
  //     if (correct) {
  //       this.score++;
  //       this.currentIndex++;
    
  //       // ✅ Actualiza los ítems después de cada intento
  //       if (this.currentIndex < this.items.length - 1) {
  //         this.currentItem = this.items[this.currentIndex];
  //         this.nextItem = this.items[this.currentIndex + 1];
  //       } else {
  //         this.gameOver = true;
  //       }
  //     } else {
  //       this.gameOver = true;
  //     }
  // }

  // restartGame() {
  //   this.currentIndex = 0;
  //   this.score = 0;
  //   this.gameOver = false;
  //   this.items = [];
  //   this.currentItem = undefined;
  //   this.nextItem = undefined;
  //   this.page = 1;
  //   this.loading = true;

  //   this.ngOnInit();
  // }

  // getMetricLabel(mood: string): string {
  //   switch (mood) {
  //     case 'track': return 'Popularidad';
  //     case 'album': return 'Popularidad';
  //     case 'artist': return 'Seguidores';
  //     default: return 'Métrica';
  //   }
  // }
  
}
