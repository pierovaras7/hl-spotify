import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-return',
  imports: [FontAwesomeModule],
  templateUrl: './return.component.html',
  styleUrl: './return.component.css'
})
export class ReturnComponent {
  @Output() action = new EventEmitter<void>(); // Emisor de eventos

  faCircleLeft = faCircleLeft
  
  return() {
    this.action.emit()
  }
}
