import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tab-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tab-nav.component.html',
  styleUrl: './tab-nav.component.scss',
})
export class TabNavComponent {
  readonly tabs = [
    { path: '/', label: 'Главная' },
    { path: '/details', label: 'Детали' },
    { path: '/rsvp', label: 'RSVP' },
    { path: '/game', label: 'Игра' },
  ];
}
