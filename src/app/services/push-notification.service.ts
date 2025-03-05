/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/naming-convention */
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor() {}

  private apiUrl =
    'https://fcm.googleapis.com/v1/projects/pwa-test-a706a/messages:send';

  http = inject(HttpClient);
  tokenService = inject(TokenService);

  async sendPushNotification(token: string, title: string, body: string) {
    const response = await this.tokenService.getAccessToken();

    if (!response || !response.accessToken) {
      throw new Error('Failded to retrieve access token');
    }

    const accessToken = response.accessToken;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });

    const notificationPayload = {
      message: {
        token: token,
        notification: {
          title: title,
          body: body,
        },
      },
    };

    return this.http
      .post(this.apiUrl, notificationPayload, { headers })
      .toPromise();
  }
}
