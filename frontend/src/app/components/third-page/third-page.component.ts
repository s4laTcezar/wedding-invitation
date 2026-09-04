import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

type GameStage = 'intro' | 'playing' | 'finished';
type GameOutcome = 'won' | 'lost' | null;
type FallingItemType = 'bouquet' | 'bomb';

interface FallingItem {
  id: number;
  type: FallingItemType;
  x: number;
  y: number;
}

const GAME_DURATION_MS = 20000;
const BOUQUET_SPAWN_INTERVAL_MS = 700;
const BOMB_SPAWN_INTERVAL_MS = 2800;
const FALL_SPEED_PX_PER_S = 90;
const BOUQUET_SIZE = 46;
const BOMB_SIZE = 40;
const BOMB_HITBOX_SIZE = 26;
const BASKET_WIDTH = 76;
const BASKET_HEIGHT = 60;
const WIN_SCORE = 10;

const ASSET_URLS = [
  '/assets/basket.png',
  '/assets/bouquet.png',
  '/assets/pngtree-boom-illustration-game-pixel-png-image_5683821.png',
  '/assets/gameBackground.jpg',
  '/assets/nextBackgound.svg',
];

@Component({
  selector: 'app-third-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './third-page.component.html',
  styleUrl: './third-page.component.scss',
})
export class ThirdPageComponent implements OnInit, OnDestroy {
  @ViewChild('gameWindow') private readonly gameWindowRef?: ElementRef<HTMLDivElement>;

  stage: GameStage = 'intro';
  outcome: GameOutcome = null;
  score = 0;
  timeLeft = GAME_DURATION_MS / 1000;
  items: FallingItem[] = [];
  basketX = 50;
  assetsReady = false;

  readonly winScore = WIN_SCORE;

  private nextId = 0;
  private bouquetSpawnTimer?: ReturnType<typeof setInterval>;
  private bombSpawnTimer?: ReturnType<typeof setInterval>;
  private countdownTimer?: ReturnType<typeof setInterval>;
  private rafId?: number;
  private lastFrameTime = 0;
  private windowWidth = 320;
  private windowHeight = 480;

  ngOnInit(): void {
    Promise.all(
      ASSET_URLS.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          }),
      ),
    ).then(() => {
      this.assetsReady = true;
    });
  }

  start(): void {
    this.stage = 'playing';
    this.outcome = null;
    this.score = 0;
    this.items = [];
    this.basketX = 50;
    this.timeLeft = GAME_DURATION_MS / 1000;

    const el = this.gameWindowRef?.nativeElement;
    if (el) {
      this.windowWidth = el.clientWidth;
      this.windowHeight = el.clientHeight;
    }

    this.bouquetSpawnTimer = setInterval(() => this.spawnItem('bouquet'), BOUQUET_SPAWN_INTERVAL_MS);
    this.bombSpawnTimer = setInterval(() => this.spawnItem('bomb'), BOMB_SPAWN_INTERVAL_MS);
    this.countdownTimer = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.finish(this.score >= WIN_SCORE ? 'won' : 'lost');
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

  private spawnItem(type: FallingItemType): void {
    const size = type === 'bomb' ? BOMB_SIZE : BOUQUET_SIZE;
    const x = Math.random() * (this.windowWidth - size);
    this.items.push({ id: this.nextId++, type, x, y: -size });
  }

  private tick(time: number): void {
    const dt = (time - this.lastFrameTime) / 1000;
    this.lastFrameTime = time;

    const basketTop = this.windowHeight - BASKET_HEIGHT;
    const basketLeft = this.basketX - BASKET_WIDTH / 2;
    const basketRight = this.basketX + BASKET_WIDTH / 2;

    const remaining: FallingItem[] = [];
    for (const item of this.items) {
      item.y += FALL_SPEED_PX_PER_S * dt;

      const visualSize = item.type === 'bomb' ? BOMB_SIZE : BOUQUET_SIZE;
      const hitboxSize = item.type === 'bomb' ? BOMB_HITBOX_SIZE : BOUQUET_SIZE;
      const hitboxTop = item.y + (visualSize - hitboxSize) / 2;
      const itemBottom = hitboxTop + hitboxSize;
      const itemCenterX = item.x + visualSize / 2;
      const caught = itemBottom >= basketTop && itemCenterX >= basketLeft && itemCenterX <= basketRight;

      if (caught) {
        if (item.type === 'bomb') {
          this.finish('lost');
          return;
        }
        this.score++;
        if (this.score >= WIN_SCORE) {
          this.finish('won');
          return;
        }
        continue;
      }

      if (item.y > this.windowHeight) {
        continue;
      }

      remaining.push(item);
    }
    this.items = remaining;

    if (this.stage === 'playing') {
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    }
  }

  private finish(outcome: GameOutcome): void {
    this.stage = 'finished';
    this.outcome = outcome;
    this.items = [];
    this.stopTimers();
  }

  private stopTimers(): void {
    if (this.bouquetSpawnTimer) {
      clearInterval(this.bouquetSpawnTimer);
    }
    if (this.bombSpawnTimer) {
      clearInterval(this.bombSpawnTimer);
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
