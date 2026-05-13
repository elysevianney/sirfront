import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './layout/layout';
import { ElementsView } from './pages/elements-view/elements-view';
import { BookCreate } from './pages/elements-view/book-create/book-create';
import { MagazineCreate } from './pages/elements-view/magazine-create/magazine-create';
import { MyBorrows } from './pages/my-borrows/my-borrows';
import { AdminBorrows } from './pages/admin-borrows/admin-borrows';
import { authGuard } from './services/auth.guard';

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
        canActivate: [authGuard],
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
      {
        path: 'my-borrows',
        component: MyBorrows,
      },
      {
        path: 'borrows',
        component: AdminBorrows,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
