import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-next-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './next-page.component.html',
  styleUrl: './next-page.component.scss',
})
export class NextPageComponent {}
