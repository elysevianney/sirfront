import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LayoutBase } from './layout-base';
import { AuthService } from '../services/authservice';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout extends LayoutBase {
  private readonly authService = inject(AuthService);

  readonly sidebarOpen = signal(true);
  readonly menuItems = computed(() => {
    const items = [...this.baseMenuItems];
    if (this.authService.isAdmin()) {
      items.push({ label: 'Demandes', path: '/borrows', icon: '📋' });
    } else if (this.authService.isLoggedIn()) {
      items.push({ label: 'Mes demandes', path: '/my-borrows', icon: '📋' });
    }
    return items;
  });

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }
}
