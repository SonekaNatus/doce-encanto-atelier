import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Produtos } from './pages/produtos/produtos';
import { Login } from './pages/login/login';
import { Success } from './pages/success/success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'produtos', component: Produtos },
  { path: 'login', component: Login },
  { path: 'success', component: Success }
];
