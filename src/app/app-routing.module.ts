import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { GraphicComponent } from './graphic/graphic.component';
import { WalletComponent } from './wallet/wallet.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'graphic', component: GraphicComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'search', component: SearchComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
