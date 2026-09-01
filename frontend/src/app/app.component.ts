import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabNavComponent } from './components/tab-nav/tab-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TabNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
