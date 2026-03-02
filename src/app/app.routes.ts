import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProdottiComponent } from './pages/prodotti/prodotti';
import { ClientiComponent } from './pages/clienti/clienti';
import { OrdiniComponent } from './pages/ordini/ordini';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'prodotti', component: ProdottiComponent },
  { path: 'clienti', component: ClientiComponent },
  { path: 'ordini', component: OrdiniComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];