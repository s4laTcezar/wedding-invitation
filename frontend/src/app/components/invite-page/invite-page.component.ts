import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invite-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './invite-page.component.html',
  styleUrl: './invite-page.component.scss',
})
export class InvitePageComponent {
  @ViewChild('sourceVideo') private readonly sourceVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') private readonly canvasRef?: ElementRef<HTMLCanvasElement>;

  envelopeOpen = false;

  open(): void {
    if (this.envelopeOpen) {
      return;
    }
    this.envelopeOpen = true;

    const video = this.sourceVideoRef?.nativeElement;
    const canvas = this.canvasRef?.nativeElement;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!video || !canvas || !ctx) {
      return;
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext('2d', { willReadFrequently: true });
    if (!octx) {
      return;
    }

    const drawFrame = () => {
      if (video.paused || video.ended) {
        return;
      }

      const halfWidth = video.videoWidth / 2;
      const fullHeight = video.videoHeight;

      octx.drawImage(video, 0, 0, halfWidth, fullHeight, 0, 0, canvas.width, canvas.height);
      const rgbFrame = octx.getImageData(0, 0, canvas.width, canvas.height);

      octx.drawImage(video, halfWidth, 0, halfWidth, fullHeight, 0, 0, canvas.width, canvas.height);
      const maskFrame = octx.getImageData(0, 0, canvas.width, canvas.height);

      const rgbData = rgbFrame.data;
      const maskData = maskFrame.data;
      for (let i = 0; i < rgbData.length; i += 4) {
        rgbData[i + 3] = maskData[i];
      }

      ctx.putImageData(rgbFrame, 0, 0);
      requestAnimationFrame(drawFrame);
    };

    video.currentTime = 0;
    video.play().then(() => requestAnimationFrame(drawFrame));
  }
}
