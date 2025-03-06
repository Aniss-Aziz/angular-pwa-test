/* eslint-disable @typescript-eslint/naming-convention */
// import { initializeApp, getApp, getApps } from 'firebase/app';
import * as firebase from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';

const firebaseCloudMessaging = {
  tokenInlocalStorage: async () => {
    return localStorage.getItem('fcm_token');
  },

  init: async function () {
    if (!firebase.getApps().length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyBJIq2njSJ-7_EnhUQebBMwpNy2yb6uRpo',
        authDomain: 'pwa-test-a706a.firebaseapp.com',
        projectId: 'pwa-test-a706a',
        storageBucket: 'pwa-test-a706a.firebasestorage.app',
        messagingSenderId: '294101868928',
        appId: '1:294101868928:web:7486aa7e590e667c5a2165',
        measurementId: 'G-1PTVSBZ8MG',
      });

      try {
        const messaging = getMessaging();
        const tokenInlocalStorage = await this.tokenInlocalStorage();

        if (tokenInlocalStorage !== null) {
          return tokenInlocalStorage;
        }

        const status = await Notification.requestPermission();
        if (status && status === 'granted') {
          const fcm_token = await getToken(messaging, {
            vapidKey:
              'BPB8VnaZlKUGN0KjePOR50LPysumdnM6ZAOIDSs90wl4hsX8dm0HQMnvTyj_3sqJPPb9F0pWc9VodN3Lz1etGDY',
          });
          if (fcm_token) {
            localStorage.setItem('fcm_token', fcm_token);

            return fcm_token;
          }
        }
      } catch (error) {
        console.error(error);

        return null;
      }
    }
  },
  
  getMessage: async function () {
    if (firebase.getApps().length > 0) {
      try {
        const messaging = getMessaging();
        onMessage(messaging, (payload) => {
          console.log('Message Received', payload);
        });
      } catch (error) {}
    }
  },
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyBJIq2njSJ-7_EnhUQebBMwpNy2yb6uRpo',
//   authDomain: 'pwa-test-a706a.firebaseapp.com',
//   projectId: 'pwa-test-a706a',
//   storageBucket: 'pwa-test-a706a.firebasestorage.app',
//   messagingSenderId: '294101868928',
//   appId: '1:294101868928:web:7486aa7e590e667c5a2165',
//   measurementId: 'G-1PTVSBZ8MG',
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// const messaging = async () => {
//   const supported = await isSupported();

//   return supported ? getMessaging(app) : null;
// };
