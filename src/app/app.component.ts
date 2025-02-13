import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { IndexComponent } from "./components/index/index.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'hsdsdsd';
}
