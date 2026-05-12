import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ElementService } from '../../../services/element.service';

@Component({
  standalone: true,
  selector: 'app-book-create',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-create.html',
  styleUrls: ['./book-create.css'],
})
export class BookCreate {
  private readonly elementService = inject(ElementService);
  private readonly router = inject(Router);

  protected readonly title = signal('');
  protected readonly author = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected submit() {
    this.error.set(null);
    this.saving.set(true);

    this.elementService.createBook({
      title: this.title(),
      author: this.author(),
      media: 'BOOK',
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/elements']).then();
      },
      error: () => {
        this.error.set('Impossible de créer le livre.');
        this.saving.set(false);
      },
    });
  }
}
