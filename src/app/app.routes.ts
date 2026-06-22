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
    pathMatch: 'full',
  },
  {
    path: 'clienti/nuovo',
    loadComponent: () =>
      import('./pages/nuovo-cliente/nuovo-cliente').then((m) => m.NuovoClienteComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ordini',
    loadComponent: () => import('./pages/ordini/ordini').then((m) => m.OrdiniComponent),
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'ordini/seleziona-cliente',
    loadComponent: () =>
      import('./pages/seleziona-cliente-ordine/seleziona-cliente-ordine').then(
        (m) => m.SelezionaClienteOrdineComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'ordini/nuovo',
    loadComponent: () =>
      import('./pages/ordine-vendita/ordine-vendita').then((m) => m.OrdineVenditaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ordini/dettaglio/:numeroOrdine',
    loadComponent: () =>
      import('./pages/dettaglio-ordine/dettaglio-ordine').then((m) => m.DettaglioOrdineComponent),
    canActivate: [authGuard],
  },
  {
    path: 'ordini/:vista',
    loadComponent: () => import('./pages/ordini/ordini').then((m) => m.OrdiniComponent),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
