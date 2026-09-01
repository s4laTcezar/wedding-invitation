import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    // withHashLocation — чтобы прямые ссылки на #/rsvp, #/details и т.д.
    // работали на любом статическом хостинге без настройки rewrite-правил
    provideRouter(routes, withHashLocation()),
  ],
};
