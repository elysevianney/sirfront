import { IconName } from '../shared/icon/icon';

export interface LayoutMenuItem {
  label: string;
  path: string;
  icon: IconName;
}

export class LayoutBase {
  readonly baseMenuItems: LayoutMenuItem[] = [
    { label: 'Eléments', path: '/elements', icon: 'box' },
  ];
}
