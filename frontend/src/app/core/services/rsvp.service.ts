import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RsvpRequest, RsvpResponse } from '../models/rsvp.model';

@Injectable({
  providedIn: 'root',
})
export class RsvpService {
  private readonly endpoint = `${environment.apiUrl}/rsvp`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Отправляет ответ гостя на backend, который пересылает
   * сообщение в Telegram-бота организаторам.
   */
  submit(payload: RsvpRequest): Observable<RsvpResponse> {
    return this.http.post<RsvpResponse>(this.endpoint, payload);
  }
}
