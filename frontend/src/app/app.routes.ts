import { Routes } from '@angular/router';
import { InvitePageComponent } from './components/invite-page/invite-page.component';
import { NextPageComponent } from './components/next-page/next-page.component';

export const routes: Routes = [
  { path: '', component: InvitePageComponent },
  { path: 'next', component: NextPageComponent },
  { path: '**', redirectTo: '' },
];
