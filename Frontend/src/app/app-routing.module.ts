import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardGuard } from 'src/app/guards/auth.guard';

import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { MonumentsComponent } from './monuments/monuments.component';
import { EventBymonumentComponent } from './event-bymonument/event-bymonument.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'events', component: EventsComponent },
  { path: 'home', component: HomeComponent},
  { path: 'details/:id', component: EventDetailsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'buy/:id/:quantidade/:usePointsCheckbox', component: BuyTicketComponent, canActivate: [AuthGuardGuard]},
 //no buy a quantidade vai servir para edpois no backend fazer um ciclo for para afzer varios bilhetes IMPORTANTE É PRECISO ADICIONAR
 ///:id_evento/:id_user ao path de buy
 { path: 'monuments', component: MonumentsComponent},
 { path: 'monuments/eventBymonument/:id', component: EventBymonumentComponent},
 { path: 'register', component: RegisterComponent},
 { path: 'login', component: LoginComponent},
 { path: 'profile', component: UserComponent, canActivate: [AuthGuardGuard]}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
