import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, animate, style} from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-game-result',
  imports: [NgIf, NgStyle],
  templateUrl: './game-result.component.html',
  styleUrl: './game-result.component.css',
  animations: [
    trigger('slideIn', [
      // Entrada (cuando aparece)
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('1s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      // Salida (cuando desaparece)
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('1s ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class GameResultComponent {
   // Indica si el juego terminó por fallo o si ganó
   @Input() gameOver: boolean = false;
   @Input() gameWon: boolean = false;
   // Puntuación final
   @Input() score: number = 0;
   // Evento para reiniciar el juego
   @Output() restartGame: 
   EventEmitter<void> = new EventEmitter();

   backgroundGif: string = '';

    constructor(private router :Router){

    }
    ngOnChanges() {
      // Asigna el GIF adecuado dependiendo del estado del juego usando URLs de GIFs en línea
      if (this.gameWon) {
        this.backgroundGif = 'url("https://media1.tenor.com/m/5q3Sq48vLmMAAAAd/kendrick-lamar-kdot.gif")'; // URL del GIF de victoria
      } else if (this.gameOver) {
        this.backgroundGif = 'url("https://i.pinimg.com/originals/07/00/6d/07006d7a2c23d60393dd4899bad6240f.gif")'; // URL del GIF de fin de juego
      }
    }
  
    onRestart() {
      this.restartGame.emit();
    }

    goHome(){
      this.router.navigate(['/']);
    }
}
