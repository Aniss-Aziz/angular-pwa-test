import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}
  http = inject(HttpClient);

  getAccessToken() {
    return this.http
      .post<{ accessToken: string }>(
        'https://backend-fcm.onrender.com/getAccessToken',
        {}
      )
      .toPromise();
  }

  subscribeUserToTopic(token: any, topic: any): Observable<any> {
    console.log(
      'subscribeUserToTopic called with token:',
      token,
      'and topic:',
      topic
    );
    const body = {
      token,
      topic,
    };
    return this.http.post('http://localhost:3000/subscribe-to-topic', body);
  }
}

