import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProdottiComponent } from './pages/prodotti/prodotti';
import { ClientiComponent } from './pages/clienti/clienti';
import { OrdiniComponent } from './pages/ordini/ordini';
import { LoginComponent } from './pages/login/login';
import { OrdineVenditaComponent } from './pages/ordine-vendita/ordine-vendita';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'prodotti', component: ProdottiComponent, canActivate: [authGuard] },
  { path: 'clienti', component: ClientiComponent, canActivate: [authGuard] },
  { path: 'ordini', component: OrdiniComponent, canActivate: [authGuard] },
  { path: 'ordini/nuovo', component: OrdineVenditaComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];