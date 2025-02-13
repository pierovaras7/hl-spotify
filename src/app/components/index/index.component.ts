import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  imports: [NgIf, NgFor],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
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
}
