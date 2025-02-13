import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpotify} from '@fortawesome/free-brands-svg-icons';
import { faHome, faCircleLeft } from '@fortawesome/free-solid-svg-icons';

import { trigger, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-index',
  imports: [NgIf, NgFor, FontAwesomeModule, NgStyle ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class IndexComponent {
  showCategories = false;
  showOptions = false;
  showMoods = false;

  selectedCategory: string = '';
  selectedOption: string = '';
  selectedMood: string = '';

  categoriesTrack: string[] = ['artist', 'genre'];
  optionsArtist: string[] = ['Taylor Swift', 'Luis Miguel', 'Bad Bunny', 'Soda Stereo'];
  optionGenre: string[] = ['Pop en Español', 'Pop en Ingles', 'Rock en Español', 'Rock en Ingles', 'Baladas', 'Hip Hop','Reggaeton', 'Salsa'];
  options: string[] = [];
  moods: string[] = ['artist', 'track', 'album'];
  urlSegments: any[] = [];

  faSpotify = faSpotify;
  faCircleLeft = faCircleLeft
  faHome = faHome;

  constructor (private router :Router){}

  startGame() {
    this.showMoods = true;
  }

  selectMood(mood: string){
    this.urlSegments = ['/game']; 
    this.urlSegments.push(mood);
    this.showMoods = false;
    if(mood != 'track'){
      this.router.navigate(this.urlSegments);
    }else{
      this.showCategories = true;
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.options = category === 'artist' ? this.optionsArtist : this.optionGenre;
    this.showCategories = false;
    this.showOptions = true;  
  }

  startGameWithSelection(selection: string) {
    this.urlSegments.push(this.selectedCategory);
    this.urlSegments.push(selection);
    this.router.navigate(this.urlSegments);
  }

  goBackMood() {
    this.showCategories = false;
    this.showMoods = true;
  }

  goBackToCategories() {
    this.showCategories = true;
    this.showOptions = false
  }

  goStart(){
    this.showMoods= false;
    this.showCategories = false;
    this.showOptions = false
  }

  sanitizeOption(option: string): string {
    return option.toLowerCase().split(' ').join('');
  }
  
}
