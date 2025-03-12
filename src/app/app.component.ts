/* eslint-disable @typescript-eslint/naming-convention */
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environment';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { PushNotificationService } from './services/push-notification.service';
import { CommonModule } from '@angular/common';

/**
 *
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  notificationPayload: any = null;
  registrationToken: string | null = null;
  date = Date.now();
  isWebCamActive: boolean = false;
  webcamStream: MediaStream | null = null;
  props = ['name', 'email', 'tel', 'address', 'icon'];
  opts = { multiple: true };
  supported = 'contacts' in navigator && 'ContactsManager' in window;

  pushService = inject(PushNotificationService);

  ngOnInit(): void {
    this.initNotificationPermission();
    this.loadRegistrationToken();
    this.initMessageListener();
  }

  async sendNotification() {
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      console.error('❌ Aucun token FCM trouvé. Active les notifications.');
      return;
    }
    const title = 'Hello';
    const body = `This is a test notification + ${new Date()
      .toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ' à')
      .replace(':', 'h')}`;

    try {
      await this.pushService.sendPushNotification(token, title, body);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification', error);
    }
  }

  initNotificationPermission() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', { scope: '/' })
        .then((registration) => {
          console.log(
            'Service Worker registered with scope',
            registration.scope
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
    const firebaseMessaging = getMessaging();
    getToken(firebaseMessaging, {
      vapidKey: environment.firebaseConfig.vapidKey,
    }).then((registrationToken) => {
      if (registrationToken) {
        console.log('Success! Token obtained successfully');
        console.log(registrationToken);
        localStorage.setItem('fcm_token', registrationToken);
        const fcmToken = localStorage.getItem('fcm_token');
        console.log(fcmToken);
      } else {
        console.log(
          'No token available. Please grant permission to generate one'
        );
      }
    });
  }

  allowNotification() {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        const notify = new Notification('First Notification', {
          body: 'Test Notification',
          tag: '1',
          icon: '/logo-multidiag.png', // Assurez-vous que le chemin de l'icône est correct
        });
      } else {
        console.log('Permission refusée');
      }
    });
  }

  loadRegistrationToken() {
    this.registrationToken = localStorage.getItem('fcm_token');
  }

  initMessageListener() {
    const firebaseMessaging = getMessaging();
    onMessage(firebaseMessaging, (messagePayload) => {
      console.log('New message received:', messagePayload);
      this.notificationPayload = messagePayload;

      if (messagePayload.notification) {
        const { title, body } = messagePayload.notification;
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title ?? 'No title', {
            body: body ?? 'No body',
            icon: '/logo-multidiag.png', // Assurez-vous que le chemin de l'icône est correct
          });
        });
      } else {
        console.warn(
          'Received message without notification payload:',
          messagePayload
        );
      }
    });
  }

  async requestBluetoothDevice() {
    console.log('Requesting Bluetooth Device...');

    if (!navigator.bluetooth) {
      console.error('Bluetooth API is not available in this browser.');
      alert(
        'Bluetooth API is not available in this browser. Please use a compatible browser.'
      );
      return;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        optionalServices: ['battery_service'],
        acceptAllDevices: true,
      });

      console.log('Name:', device.name);

      if (!device.gatt) {
        console.error('GATT server not available on this device.');
        return;
      }

      const server = await device.gatt.connect();
      console.log('Connected to GATT server:', server);

      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value = await characteristic.readValue();
      console.log(`Battery percentage is ${value.getUint8(0)}%`);
    } catch (error) {
      console.error('Argh! ', error);
    }
  }

  async requestContact() {
    if (this.supported) {
      try {
        const contacts = await navigator.contacts.select(this.props, this.opts);
        console.log('Contacts:', contacts);
      } catch (error) {
        console.error('Error accessing contacts:', error);
      }
    } else {
      console.error('Contacts API not supported in this browser.');
      alert('Contacts API not supported in this browser.');
    }
  }

  requestLocation(): void {
    const status: HTMLElement | null = document.querySelector('#status');
    const mapLink: HTMLAnchorElement | null =
      document.querySelector('#map-link');

    if (mapLink) {
      mapLink.href = '';
      mapLink.textContent = '';
    }

    function success(position: GeolocationPosition): void {
      const latitude: number = position.coords.latitude;
      const longitude: number = position.coords.longitude;

      if (status) {
        status.textContent = '';
      }

      if (mapLink) {
        mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
      }
    }

    function error(): void {
      if (status) {
        status.textContent = 'Unable to retrieve your location';
      }
    }

    if (!navigator.geolocation) {
      if (status) {
        status.textContent = 'Geolocation is not supported by your browser';
      }
    } else {
      if (status) {
        status.textContent = 'Locating…';
      }
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  async requestWebCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const video = document.querySelector(
        'video#webcam',
      ) as HTMLVideoElement | null;
      if (video) {
        video.srcObject = stream;
        this.webcamStream = stream;
        this.isWebCamActive = true;
        video.classList.add('active');
      }

      // Ajouter un bouton pour entrer en mode Picture-in-Picture
      const pipButton = document.createElement('button');
      pipButton.textContent = 'Enter Picture-in-Picture';
      pipButton.classList.add('btn', 'btn-warning', 'mb-3');
      pipButton.onclick = () => {
        if (video) {
          video.requestPictureInPicture();
        }
      };

      // Ajouter le bouton au DOM
      const container = document.querySelector('.video-container');
      if (container) {
        container.appendChild(pipButton);
      }
    } catch (error) {
      console.error('Error accessing the webcam: ', error);
    }
  }

  stopWebCam() {
    if (this.webcamStream) {
      const tracks = this.webcamStream.getTracks();
      tracks.forEach((track) => track.stop());
      const video = document.querySelector(
        'video#webcam',
      ) as HTMLVideoElement | null;
      if (video) {
        video.srcObject = null;
        video.classList.remove('active');
      }
      this.webcamStream = null;
      this.isWebCamActive = false;

      // Retirer le bouton Picture-in-Picture
      const pipButton = document.querySelector('.btn-warning');
      if (pipButton) {
        pipButton.remove();
      }
    }
  }
}
