import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
  {
    path: 'prodotti',
    loadComponent: () => import('./pages/prodotti/prodotti').then((m) => m.ProdottiComponent),
    canActivate: [authGuard],
  },
  {
    path: 'clienti',
    loadComponent: () => import('./pages/clienti/clienti').then((m) => m.ClientiComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ordini',
    loadComponent: () => import('./pages/ordini/ordini').then((m) => m.OrdiniComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ordini/nuovo',
    loadComponent: () =>
      import('./pages/ordine-vendita/ordine-vendita').then((m) => m.OrdineVenditaComponent),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
