import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css'],
})
export class GameOverComponent {
  @Input() score!: number; // Recibe el puntaje final
  @Output() restartGame = new EventEmitter<void>(); // Emite el evento para reiniciar
}
