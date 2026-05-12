import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ElementService } from '../../../services/element.service';

@Component({
  standalone: true,
  selector: 'app-magazine-create',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './magazine-create.html',
  styleUrls: ['./magazine-create.css'],
})
export class MagazineCreate {
  private readonly elementService = inject(ElementService);
  private readonly router = inject(Router);

  protected readonly title = signal('');
  protected readonly datePublication = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected submit() {
    this.error.set(null);
    this.saving.set(true);

    this.elementService.createMagazine({
      title: this.title(),
      media: 'MAG',
      datePublication: this.datePublication(),
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/elements']).then();
      },
      error: () => {
        this.error.set('Impossible de créer le magazine.');
        this.saving.set(false);
      },
    });
  }
}
