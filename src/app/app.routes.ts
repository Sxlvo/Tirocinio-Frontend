import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProdottiComponent } from './pages/prodotti/prodotti';
import { ClientiComponent } from './pages/clienti/clienti';
import { OrdiniComponent } from './pages/ordini/ordini';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'prodotti', component: ProdottiComponent, canActivate: [authGuard] },
  { path: 'clienti', component: ClientiComponent, canActivate: [authGuard] },
  { path: 'ordini', component: OrdiniComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];