import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type IconName =
  | 'box'
  | 'check'
  | 'chevron-left'
  | 'chevron-right'
  | 'clipboard-list'
  | 'home'
  | 'log-out'
  | 'loader-circle'
  | 'pencil'
  | 'trash'
  | 'user';

@Component({
  standalone: true,
  selector: 'app-icon',
  imports: [CommonModule],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="h-5 w-5"
    >
      <ng-container [ngSwitch]="name">
        <ng-container *ngSwitchCase="'box'">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </ng-container>
        <ng-container *ngSwitchCase="'check'">
          <path d="M20 6 9 17l-5-5" />
        </ng-container>
        <ng-container *ngSwitchCase="'chevron-left'">
          <path d="m15 18-6-6 6-6" />
        </ng-container>
        <ng-container *ngSwitchCase="'chevron-right'">
          <path d="m9 18 6-6-6-6" />
        </ng-container>
        <ng-container *ngSwitchCase="'clipboard-list'">
          <rect width="8" height="4" x="8" y="2" rx="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M8 11h8" />
          <path d="M8 16h5" />
        </ng-container>
        <ng-container *ngSwitchCase="'home'">
          <path d="m3 10 9-7 9 7" />
          <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
          <path d="M9 21v-6h6v6" />
        </ng-container>
        <ng-container *ngSwitchCase="'log-out'">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </ng-container>
        <ng-container *ngSwitchCase="'loader-circle'">
          <path d="M21 12a9 9 0 1 1-6.2-8.56" />
        </ng-container>
        <ng-container *ngSwitchCase="'pencil'">
          <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </ng-container>
        <ng-container *ngSwitchCase="'trash'">
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
        </ng-container>
        <ng-container *ngSwitchCase="'user'">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </ng-container>
      </ng-container>
    </svg>
  `,
})
export class Icon {
  @Input({ required: true }) name!: IconName;
}
