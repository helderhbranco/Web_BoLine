import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { ToastrModule } from 'ngx-toastr';

import { AuthInterceptorInterceptor } from './interceptors/auth-interceptor.interceptor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { MonumentsComponent } from './monuments/monuments.component';
import { EventBymonumentComponent } from './event-bymonument/event-bymonument.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserComponent } from './user/user.component';
import { UserTicketsComponent } from './user-tickets/user-tickets.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    NavbarComponent,
    HomeComponent,
    EventDetailsComponent,
    BuyTicketComponent,
    MonumentsComponent,
    EventBymonumentComponent,
    LoginComponent,
    RegisterComponent,
    UserDetailsComponent,
    UserComponent,
    UserTicketsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
