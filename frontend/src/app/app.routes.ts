import { Routes } from '@angular/router';
import { InvitePageComponent } from './components/invite-page/invite-page.component';
import { DetailsPageComponent } from './components/details-page/details-page.component';
import { RsvpPageComponent } from './components/rsvp-page/rsvp-page.component';
import { GamePageComponent } from './components/game-page/game-page.component';

export const routes: Routes = [
  { path: '', component: InvitePageComponent },
  { path: 'details', component: DetailsPageComponent },
  { path: 'rsvp', component: RsvpPageComponent },
  { path: 'game', component: GamePageComponent },
  { path: '**', redirectTo: '' },
];
