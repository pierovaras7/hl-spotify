import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gif-card',
  imports: [NgStyle],
  templateUrl: './gif-card.component.html',
  styleUrl: './gif-card.component.css'
})
export class GifCardComponent {
  @Input() image!: string;  // Nombre del archivo GIF (sin extensión)
  @Input() text!: string;   // Texto de la card
}
