import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutBase } from '../../layout/layout-base';
import { ElementService, ElementItem } from '../../services/element.service';
import { AuthService } from '../../services/authservice';

@Component({
  standalone: true,
  selector: 'app-elements-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './elements-view.html',
  styleUrls: ['./elements-view.css'],
})
export class ElementsView extends LayoutBase implements OnInit {
  private readonly elementService = inject(ElementService);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly items = signal<ElementItem[]>([]);
  protected readonly search = signal('');
  protected readonly filteredItems = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return this.items();
    return this.items().filter((item) => {
      const title = item.title.toLowerCase();
      const author = item.author?.toLowerCase() ?? '';
      return title.includes(query) || author.includes(query);
    });
  });
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly isAdmin = this.authService.isAdmin;

  constructor() {
    super();
  }

  ngOnInit() {
    console.debug('ElementsView ngOnInit currentUser', this.authService.currentUser());
    console.debug('ElementsView ngOnInit isAdmin', this.isAdmin());
    if (this.isBrowser) {
      this.loadElements();
    }
  }

  private loadElements() {
    console.debug('ElementsView: chargement des éléments...');
    this.elementService.getElements().subscribe({
      next: (data) => {
        console.debug('ElementsView: éléments reçus', data);
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('ElementsView: erreur lors du chargement des éléments', err);
        this.error.set('Impossible de charger les éléments.');
        this.loading.set(false);
      },
    });
  }

  getTypeLabel(item: ElementItem) {
    return item.media === 'BOOK' ? 'Livre' : 'Magazine';
  }
}
