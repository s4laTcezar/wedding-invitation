import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RsvpService } from '../../core/services/rsvp.service';
import { WEDDING_CONFIG } from '../../core/models/wedding-config';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-rsvp-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rsvp-page.component.html',
  styleUrl: './rsvp-page.component.scss',
})
export class RsvpPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly rsvpService = inject(RsvpService);

  readonly rsvpDeadlineText = WEDDING_CONFIG.rsvpDeadlineText;
  status: SubmitStatus = 'idle';

  readonly form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    attending: [true, Validators.required],
    responseText: [''],
  });

  get attending(): boolean {
    return this.form.controls.attending.value === true;
  }

  choose(attending: boolean): void {
    this.form.controls.attending.setValue(attending);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'sending';
    const value = this.form.getRawValue();

    this.rsvpService
      .submit({
        fullName: value.fullName!.trim(),
        attending: value.attending!,
        responseText: value.responseText?.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.status = 'success';
          this.form.reset({ fullName: '', attending: true, responseText: '' });
        },
        error: () => {
          this.status = 'error';
        },
      });
  }
}
