import { Routes } from '@angular/router';
import { InvitePageComponent } from './components/invite-page/invite-page.component';
import { NextPageComponent } from './components/next-page/next-page.component';
import { ThirdPageComponent } from './components/third-page/third-page.component';
import { RsvpPageComponent } from './components/rsvp-page/rsvp-page.component';

export const routes: Routes = [
  { path: '', component: InvitePageComponent },
  { path: 'next', component: NextPageComponent },
  { path: 'third', component: ThirdPageComponent },
  { path: 'rsvp', component: RsvpPageComponent },
  { path: '**', redirectTo: '' },
];
