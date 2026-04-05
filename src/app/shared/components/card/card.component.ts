import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.elevated]="elevated">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      padding: 1.5rem;
      transition: all 300ms ease-out;

      &:hover {
        border-color: #ffd764;
      }

      &.elevated {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
    }
  `],
})
export class CardComponent {
  @Input() elevated = false;
}
