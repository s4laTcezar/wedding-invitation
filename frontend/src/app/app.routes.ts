import { Routes } from '@angular/router';
import { InvitePageComponent } from './components/invite-page/invite-page.component';

export const routes: Routes = [
  { path: '', component: InvitePageComponent },
  { path: '**', redirectTo: '' },
];
