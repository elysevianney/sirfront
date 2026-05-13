import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { BorrowItem, BorrowStatus, ElementService } from '../../services/element.service';

@Component({
  standalone: true,
  selector: 'app-admin-borrows',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-borrows.html',
  styleUrls: ['./admin-borrows.css'],
})
export class AdminBorrows implements OnInit {
  private readonly elementService = inject(ElementService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly borrows = signal<BorrowItem[]>([]);
  protected readonly selectedBorrow = signal<BorrowItem | null>(null);
  protected readonly selectedStatus = signal<BorrowStatus>('IN_PROGRESS');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);
  protected readonly statuses: BorrowStatus[] = ['IN_PROGRESS', 'BORROWED', 'RETURNED', 'LATE'];

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadBorrows();
    }
  }

  protected loadBorrows(): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.elementService.getAllBorrows().subscribe({
      next: (borrows) => {
        this.borrows.set(borrows);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('AdminBorrows: erreur lors du chargement des demandes', err);
        this.error.set('Impossible de charger les demandes.');
        this.loading.set(false);
      },
    });
  }

  protected selectBorrow(borrow: BorrowItem): void {
    this.selectedBorrow.set(borrow);
    this.selectedStatus.set(this.toBorrowStatus(borrow.status));
    this.success.set(null);
    this.error.set(null);
  }

  protected updateSelectedBorrow(): void {
    const borrow = this.selectedBorrow();
    if (!borrow) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    this.elementService.updateBorrow(borrow.id, {
      borrowDate: this.getTodayDate(),
      dueDate: this.getDateInOneMonth(),
      status: this.selectedStatus(),
    }).subscribe({
      next: () => {
        const updatedBorrow: BorrowItem = {
          ...borrow,
          borrowDate: this.getTodayDate(),
          dueDate: this.getDateInOneMonth(),
          status: this.selectedStatus(),
        };
        this.borrows.update((borrows) => borrows.map((item) => item.id === borrow.id ? updatedBorrow : item));
        this.selectedBorrow.set(null);
        this.success.set('Demande mise à jour.');
        this.saving.set(false);
      },
      error: (err) => {
        console.error('AdminBorrows: erreur lors de la mise à jour', err);
        this.error.set('Impossible de modifier cette demande.');
        this.saving.set(false);
      },
    });
  }

  protected getBorrowTitle(borrow: BorrowItem): string {
    return borrow.item?.title ?? 'Elément inconnu';
  }

  protected closeModal(): void {
    if (!this.saving()) {
      this.selectedBorrow.set(null);
    }
  }

  protected getUserLabel(borrow: BorrowItem): string {
    const user = borrow.user;
    if (!user) {
      return 'Utilisateur inconnu';
    }
    const fullName = [user.prenom, user.nom].filter(Boolean).join(' ');
    return fullName || user.email || `Utilisateur #${user.id}`;
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

  protected getTodayDate(): string {
    return this.formatDateForApi(new Date());
  }

  protected getDateInOneMonth(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return this.formatDateForApi(date);
  }

  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toBorrowStatus(status: string | undefined): BorrowStatus {
    return this.statuses.includes(status as BorrowStatus) ? status as BorrowStatus : 'IN_PROGRESS';
  }
}
