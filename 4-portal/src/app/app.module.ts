import { ApiService } from './shared/api.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './shared/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { EditComponent } from './screens/edit/edit.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomeComponent } from './screens/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './screens/login/login.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './screens/register/register.component';
import { SharedModule } from './shared/shared.module';
import { UsersComponent } from './screens/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    DefaultLayoutComponent,
    NavbarComponent,
    FooterComponent,
    UsersComponent,
    EditComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }