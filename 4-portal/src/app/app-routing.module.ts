import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from 'src/app/screens/home/home.component';
import { LoginComponent } from 'src/app/screens/login/login.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './screens/register/register.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
