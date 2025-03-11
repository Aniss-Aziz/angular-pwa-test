import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  constructor() {}
  http = inject(HttpClient);

  getAccessToken() {
    return this.http.post<{ accessToken: string }>(
      'https://backend-fcm.onrender.com/getAccessToken',
      {}
    ).toPromise();
  }
}

// export class TokenService {
//   private keyFile = '/pwa-test-a706a-a5bc77c95ff1.json';
//   constructor() {}
//   http = inject(HttpClient);

//   getAccessToken() {
//     const token = localStorage.getItem('fcm_token');
//     if (!token) {
//       console.error('❌ Aucun token FCM trouvé dans localStorage.');
//       return null;
//     }

//     return { accessToken: token };
//   }
// }
