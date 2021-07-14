import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


/* Componet */
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { NosotrosComponent } from './component/nosotros/nosotros.component';
import { TorneoComponent } from './component/torneo/torneo.component';
import { EditUserComponent } from './component/edit-user/edit-user.component';

/* Servicios */
import { RestUserService } from './services/restUser/rest-user.service';
import { UploadUserService } from './services/uploadUser/upload-user.service';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    NosotrosComponent,
    TorneoComponent,
    EditUserComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [RestUserService, UploadUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
