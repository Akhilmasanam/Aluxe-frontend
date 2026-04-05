import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { LoadingOverlayComponent } from './shared/components/loading/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NotificationsComponent, LoadingOverlayComponent],
  template: `
    <router-outlet></router-outlet>
    <app-notifications></app-notifications>
    <app-loading-overlay></app-loading-overlay>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class AppComponent {
  title = 'ALUXE — Akki Luxe';
}
