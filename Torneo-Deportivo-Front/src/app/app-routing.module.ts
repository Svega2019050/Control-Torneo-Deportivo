import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditUserComponent } from './component/edit-user/edit-user.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { NosotrosComponent } from './component/nosotros/nosotros.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { RegisterComponent } from './component/register/register.component';
import { TorneoComponent } from './component/torneo/torneo.component';
import { HomeEquipoComponent } from './component/home-equipo/home-equipo.component';
import { AdminGuard } from './guards/admin.guard';
import { SaveUserAdminComponent } from './component/save-user-admin/save-user-admin.component';
import { ListUserComponent } from './component/list-user/list-user.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'navbar', component: NavBarComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'nosotros', component: NosotrosComponent},
  {path: 'torneo', component: TorneoComponent},
  {path: 'editUser', component:EditUserComponent},
  {path: 'homeEquipo', component:HomeEquipoComponent},
  {path: 'saveUserAdmin', canActivate: [AdminGuard], component:SaveUserAdminComponent},
  {path: 'listUsers', canActivate:[AdminGuard], component: ListUserComponent},

  {path: 'not-Found', component: NotFoundComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
