import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LayoutBase } from './layout-base';
import { AuthService } from '../services/authservice';
import { Icon } from '../shared/icon/icon';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, Icon, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout extends LayoutBase {
  private readonly authService = inject(AuthService);

  readonly sidebarOpen = signal(true);
  readonly userMenuOpen = signal(false);
  readonly currentUser = this.authService.currentUser;
  readonly userLabel = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return 'Compte';
    }
    const fullName = [user.prenom, user.nom].filter(Boolean).join(' ');
    return fullName || user.email;
  });

  readonly menuItems = computed(() => {
    const items = [...this.baseMenuItems];
    if (this.authService.isAdmin()) {
      items.push({ label: 'Demandes', path: '/borrows', icon: 'clipboard-list' });
    } else if (this.authService.isLoggedIn()) {
      items.push({ label: 'Mes demandes', path: '/my-borrows', icon: 'clipboard-list' });
    }
    return items;
  });

  constructor() {
    super();
    this.authService.resolveCurrentUserId().subscribe();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((open) => !open);
  }

  logout(): void {
    this.userMenuOpen.set(false);
    this.authService.logout();
  }
}
