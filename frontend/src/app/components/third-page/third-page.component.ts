import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type GameStage = 'intro' | 'playing' | 'finished';

interface FallingBouquet {
  id: number;
  x: number;
  y: number;
}

const GAME_DURATION_MS = 20000;
const SPAWN_INTERVAL_MS = 700;
const FALL_SPEED_PX_PER_S = 90;
const BOUQUET_SIZE = 46;
const BASKET_WIDTH = 76;
const BASKET_HEIGHT = 60;

@Component({
  selector: 'app-third-page',
  standalone: true,
  imports: [],
  templateUrl: './third-page.component.html',
  styleUrl: './third-page.component.scss',
})
export class ThirdPageComponent implements OnDestroy {
  @ViewChild('gameWindow') private readonly gameWindowRef?: ElementRef<HTMLDivElement>;

  stage: GameStage = 'intro';
  score = 0;
  timeLeft = GAME_DURATION_MS / 1000;
  bouquets: FallingBouquet[] = [];
  basketX = 50;

  private nextId = 0;
  private spawnTimer?: ReturnType<typeof setInterval>;
  private countdownTimer?: ReturnType<typeof setInterval>;
  private rafId?: number;
  private lastFrameTime = 0;
  private windowWidth = 320;
  private windowHeight = 480;

  start(): void {
    this.stage = 'playing';
    this.score = 0;
    this.bouquets = [];
    this.basketX = 50;
    this.timeLeft = GAME_DURATION_MS / 1000;

    const el = this.gameWindowRef?.nativeElement;
    if (el) {
      this.windowWidth = el.clientWidth;
      this.windowHeight = el.clientHeight;
    }

    this.spawnTimer = setInterval(() => this.spawnBouquet(), SPAWN_INTERVAL_MS);
    this.countdownTimer = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.finish();
      }
    }, 1000);

    this.lastFrameTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }

  restart(): void {
    this.start();
  }

  onPointerMove(clientX: number): void {
    if (this.stage !== 'playing') {
      return;
    }
    const el = this.gameWindowRef?.nativeElement;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    this.basketX = Math.min(Math.max(x, BASKET_WIDTH / 2), this.windowWidth - BASKET_WIDTH / 2);
  }

  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    if (touch) {
      this.onPointerMove(touch.clientX);
    }
  }

  private spawnBouquet(): void {
    const x = Math.random() * (this.windowWidth - BOUQUET_SIZE);
    this.bouquets.push({ id: this.nextId++, x, y: -BOUQUET_SIZE });
  }

  private tick(time: number): void {
    const dt = (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;

    const basketTop = this.windowHeight - BASKET_HEIGHT;
    const basketLeft = this.basketX - BASKET_WIDTH / 2;
    const basketRight = this.basketX + BASKET_WIDTH / 2;

    const remaining: FallingBouquet[] = [];
    for (const bouquet of this.bouquets) {
      bouquet.y += FALL_SPEED_PX_PER_S * dt;

      const bouquetBottom = bouquet.y + BOUQUET_SIZE;
      const bouquetCenterX = bouquet.x + BOUQUET_SIZE / 2;

      if (bouquetBottom >= basketTop && bouquetCenterX >= basketLeft && bouquetCenterX <= basketRight) {
        this.score++;
        continue;
      }

      if (bouquet.y > this.windowHeight) {
        continue;
      }

      remaining.push(bouquet);
    }
    this.bouquets = remaining;

    if (this.stage === 'playing') {
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }
  }

  private finish(): void {
    this.stage = 'finished';
    this.bouquets = [];
    this.stopTimers();
  }

  private stopTimers(): void {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  ngOnDestroy(): void {
    this.stopTimers();
  }
}
