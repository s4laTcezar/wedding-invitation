import { Component } from '@angular/core';
import { WEDDING_CONFIG } from '../../core/models/wedding-config';

type GameStage = 'intro' | 'playing' | 'finished';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss',
})
export class GamePageComponent {
  readonly config = WEDDING_CONFIG.game;

  stage: GameStage = 'intro';
  currentIndex = 0;
  correctCount = 0;
  selectedIndex: number | null = null;

  get currentQuestion() {
    return this.config.questions[this.currentIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentIndex === this.config.questions.length - 1;
  }

  start(): void {
    this.stage = 'playing';
    this.currentIndex = 0;
    this.correctCount = 0;
    this.selectedIndex = null;
  }

  select(optionIndex: number): void {
    if (this.selectedIndex !== null) {
      return;
    }
    this.selectedIndex = optionIndex;
    if (optionIndex === this.currentQuestion.correctIndex) {
      this.correctCount++;
    }
  }

  next(): void {
    if (this.isLastQuestion) {
      this.stage = 'finished';
      return;
    }
    this.currentIndex++;
    this.selectedIndex = null;
  }

  restart(): void {
    this.start();
  }
}
