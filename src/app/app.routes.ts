import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cardapio } from './pages/cardapio/cardapio';
import { Login } from './pages/login/login';
import { Success } from './pages/success/success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cardapio', component: Cardapio },
  { path: 'login', component: Login },
  { path: 'success', component: Success }
];
