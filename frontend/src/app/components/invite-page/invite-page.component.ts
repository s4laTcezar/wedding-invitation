import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WEDDING_CONFIG } from '../../core/models/wedding-config';

@Component({
  selector: 'app-invite-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './invite-page.component.html',
  styleUrl: './invite-page.component.scss',
})
export class InvitePageComponent {
  readonly config = WEDDING_CONFIG;
}
