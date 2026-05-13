import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LayoutBase } from '../../layout/layout-base';
import { ElementService, ElementItem } from '../../services/element.service';
import { AuthService } from '../../services/authservice';

type BorrowStatus = 'idle' | 'loading' | 'done' | 'error';

@Component({
  standalone: true,
  selector: 'app-elements-view',
  imports: [CommonModule, FormsModule, RouterLink],
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
  protected readonly isUser = computed(() => this.authService.isLoggedIn() && !this.authService.isAdmin());
  protected readonly borrowStatuses = signal<Record<number, BorrowStatus>>({});
  protected readonly borrowErrors = signal<Partial<Record<number, string>>>({});
  protected readonly editingItemId = signal<number | null>(null);
  protected readonly editTitle = signal('');
  protected readonly editAuthor = signal('');
  protected readonly editDatePublication = signal('');
  protected readonly editSaving = signal(false);
  protected readonly deleteSavingId = signal<number | null>(null);
  protected readonly editError = signal<string | null>(null);

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

  protected startEdit(item: ElementItem): void {
    this.editingItemId.set(item.id);
    this.editTitle.set(item.title);
    this.editAuthor.set(item.author ?? '');
    this.editDatePublication.set(this.toDateInputValue(item.datePublication));
    this.editError.set(null);
  }

  protected cancelEdit(): void {
    this.editingItemId.set(null);
    this.editError.set(null);
  }

  protected saveEdit(item: ElementItem): void {
    this.editSaving.set(true);
    this.editError.set(null);

    const request = item.media === 'BOOK'
      ? this.elementService.updateBook(item.id, {
          title: this.editTitle(),
          author: this.editAuthor(),
          media: 'BOOK',
        })
      : this.elementService.updateMagazine(item.id, {
          id: item.id,
          title: this.editTitle(),
          media: 'MAG',
          datePublication: this.editDatePublication(),
        });

    request.subscribe({
      next: () => {
        this.items.update((items) => items.map((currentItem) => {
          if (currentItem.id !== item.id) {
            return currentItem;
          }
          return {
            ...currentItem,
            title: this.editTitle(),
            author: item.media === 'BOOK' ? this.editAuthor() : currentItem.author,
            datePublication: item.media === 'MAG' ? this.toDateArray(this.editDatePublication()) : currentItem.datePublication,
          };
        }));
        this.editSaving.set(false);
        this.cancelEdit();
      },
      error: (err) => {
        console.error("ElementsView: erreur lors de la modification de l'élément", err);
        this.editError.set("Impossible de modifier cet élément.");
        this.editSaving.set(false);
      },
    });
  }

  protected deleteItem(item: ElementItem): void {
    const confirmed = window.confirm(`Supprimer "${item.title}" ?`);
    if (!confirmed) {
      return;
    }

    this.deleteSavingId.set(item.id);
    this.elementService.deleteElement(item.id).subscribe({
      next: () => {
        this.items.update((items) => items.filter((currentItem) => currentItem.id !== item.id));
        if (this.editingItemId() === item.id) {
          this.cancelEdit();
        }
        this.deleteSavingId.set(null);
      },
      error: (err) => {
        console.error("ElementsView: erreur lors de la suppression de l'élément", err);
        this.editError.set("Impossible de supprimer cet élément.");
        this.deleteSavingId.set(null);
      },
    });
  }

  protected getBorrowStatus(itemId: number): BorrowStatus {
    return this.borrowStatuses()[itemId] ?? 'idle';
  }

  protected requestBorrow(item: ElementItem): void {
    if (this.getBorrowStatus(item.id) === 'loading') {
      return;
    }

    this.setBorrowStatus(item.id, 'loading');
    this.clearBorrowError(item.id);
    this.authService.resolveCurrentUserId().subscribe({
      next: (userId) => {
        if (!userId) {
          this.setBorrowError(item.id, 'Utilisateur introuvable.');
          return;
        }

        this.elementService.createBorrow({
          userId,
          itemId: item.id,
        }).subscribe({
          next: () => this.setBorrowStatus(item.id, 'done'),
          error: (err) => {
            console.error('ElementsView: erreur lors de la demande de prêt', err);
            this.setBorrowStatus(item.id, 'error');
          },
        });
      },
      error: (err) => {
        console.error("ElementsView: impossible de récupérer l'utilisateur", err);
        this.setBorrowError(item.id, 'Utilisateur introuvable.');
      },
    });
  }

  private setBorrowStatus(itemId: number, status: BorrowStatus): void {
    this.borrowStatuses.update((statuses) => ({
      ...statuses,
      [itemId]: status,
    }));
  }

  private setBorrowError(itemId: number, message: string): void {
    this.setBorrowStatus(itemId, 'error');
    this.borrowErrors.update((errors) => ({
      ...errors,
      [itemId]: message,
    }));
  }

  private clearBorrowError(itemId: number): void {
    this.borrowErrors.update((errors) => {
      const updatedErrors = { ...errors };
      delete updatedErrors[itemId];
      return updatedErrors;
    });
  }

  private toDateInputValue(date: number[] | undefined): string {
    if (!date) {
      return '';
    }
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private toDateArray(date: string): number[] | undefined {
    if (!date) {
      return undefined;
    }
    return date.split('-').map(Number);
  }

}
