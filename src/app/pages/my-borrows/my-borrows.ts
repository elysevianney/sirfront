import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/authservice';
import { BorrowItem, ElementService } from '../../services/element.service';

@Component({
  standalone: true,
  selector: 'app-my-borrows',
  imports: [CommonModule],
  templateUrl: './my-borrows.html',
  styleUrls: ['./my-borrows.css'],
})
export class MyBorrows implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly elementService = inject(ElementService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly borrows = signal<BorrowItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadBorrows();
    }
  }

  private loadBorrows(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.resolveCurrentUserId().subscribe({
      next: (userId) => {
        if (!userId) {
          this.error.set('Utilisateur introuvable.');
          this.loading.set(false);
          return;
        }

        this.elementService.getBorrowsByUser(userId).subscribe({
          next: (borrows) => {
            this.borrows.set(borrows);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('MyBorrows: erreur lors du chargement des demandes', err);
            this.error.set('Impossible de charger vos demandes.');
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error("MyBorrows: impossible de récupérer l'utilisateur", err);
        this.error.set('Utilisateur introuvable.');
        this.loading.set(false);
      },
    });
  }

  protected getMediaLabel(borrow: BorrowItem): string {
    return borrow.item?.media === 'BOOK' ? 'Livre' : 'Magazine';
  }

  protected formatDate(date: string | number[] | undefined): string {
    if (!date) {
      return 'Non renseignée';
    }
    if (Array.isArray(date)) {
      return `${date[2]}/${date[1]}/${date[0]}`;
    }
    return date;
  }
}
