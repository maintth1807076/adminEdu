import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './outside/login/login.component';
import {AuthGuard} from './core/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {
    path: '',
    loadChildren: () => import('./inside/inside.module').then(m => m.InsideModule),
  },
  {
    path: '',
    loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
