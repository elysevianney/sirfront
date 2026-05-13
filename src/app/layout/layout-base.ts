export interface LayoutMenuItem {
  label: string;
  path: string;
  icon?: string;
}

export class LayoutBase {
  readonly baseMenuItems: LayoutMenuItem[] = [
    { label: 'Eléments', path: '/elements', icon: '📦' },
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  ];
}
