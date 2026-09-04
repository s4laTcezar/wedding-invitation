import { Component } from '@angular/core';

@Component({
  selector: 'app-invite-page',
  standalone: true,
  imports: [],
  templateUrl: './invite-page.component.html',
  styleUrl: './invite-page.component.scss',
})
export class InvitePageComponent {
  envelopeOpen = false;

  open(): void {
    this.envelopeOpen = true;
  }
}
