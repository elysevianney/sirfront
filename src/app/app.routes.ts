import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './layout/layout';
import { ElementsView } from './pages/elements-view/elements-view';
import { BookCreate } from './pages/elements-view/book-create/book-create';
import { MagazineCreate } from './pages/elements-view/magazine-create/magazine-create';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'elements',
        component: ElementsView,
      },
      {
        path: 'elements/new/book',
        component: BookCreate,
      },
      {
        path: 'elements/new/magazine',
        component: MagazineCreate,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
