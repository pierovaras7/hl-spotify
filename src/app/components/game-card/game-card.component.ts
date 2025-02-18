import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ItemGame } from '../../interfaces/item.interface';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { isAlbumItem, isArtistItem, isTrackItem } from '../../interfaces/item-game.type-guards';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  standalone: true,
  imports: [NgIf, CommonModule],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in')
      ])
    ]),
    trigger('metricBounce', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('500ms cubic-bezier(0.68, -0.55, 0.27, 1.55)', 
          style({ opacity: 1, transform: 'scale(1.1)' })
        ),
        animate('200ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class GameCardComponent implements OnChanges {
  @Input() item!: ItemGame;
  @Input() clicked: boolean = false; 
  isAnimating: boolean = false;
  @Input() start: boolean = false;
  @Input() resultGuess: boolean = false;
  @Input() show: boolean = false;

  currentItem!: ItemGame;
  showMetricFlag = false;  
  metricAlreadyShown = false;

  isTrackItem = isTrackItem;
  isAlbumItem = isAlbumItem;
  isArtistItem = isArtistItem;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    this.showMetricFlag = this.start
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clicked'] && !changes['item']) {
      this.showMetricFlag = true;
    } 
    else if (changes['item'] && !changes['item'].firstChange) {
      this.showMetricFlag = true; 
      setTimeout(() => {
        this.isAnimating = true;
        setTimeout(() => {
          this.showMetricFlag = false; 
          this.currentItem = this.item; 
          this.isAnimating = false;
          this.cdr.detectChanges(); 
        }, 300); 
      }, 3000); 
    } 
    else {
      this.currentItem = this.item;
    }
  }
  

  getImageUrl(item: ItemGame): string {
    return item.type === 'track' ? item.imagen_url : item.img_url;
  }

  getMetricLabel(): string {
    switch (this.currentItem.type) {
      case 'track': return 'Reproducciones';
      case 'album': return 'Popularidad';
      case 'artist': return 'Oyentes mensuales';
      default: return 'Métrica';
    }
  }

  getMetricValue(): number {
    if (this.isTrackItem(this.currentItem)) return this.currentItem.reproducciones;
    if (this.isAlbumItem(this.currentItem)) return this.currentItem.popularity;
    if (this.isArtistItem(this.currentItem)) return this.currentItem.listeners;
    return 0;
  }

  showMetric(): boolean {
    return this.showMetricFlag || this.clicked || this.show; 
  }

}
