import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-invite-page',
  standalone: true,
  imports: [],
  templateUrl: './invite-page.component.html',
  styleUrl: './invite-page.component.scss',
})
export class InvitePageComponent {
  @ViewChild('video') private readonly videoRef?: ElementRef<HTMLVideoElement>;

  envelopeOpen = false;

  open(): void {
    if (this.envelopeOpen) {
      return;
    }
    this.envelopeOpen = true;

    const video = this.videoRef?.nativeElement;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  }
}
