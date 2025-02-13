import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { GameComponent } from './components/game/game.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'game/:mood/:category/:selection', component: GameComponent }, 
  { path: 'game/:mood', component: GameComponent }, 
];
