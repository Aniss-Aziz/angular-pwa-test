/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyBJIq2njSJ-7_EnhUQebBMwpNy2yb6uRpo",
  authDomain: "pwa-test-a706a.firebaseapp.com",
  projectId: "pwa-test-a706a",
  storageBucket: "pwa-test-a706a.firebasestorage.app",
  messagingSenderId: "294101868928",
  appId: "1:294101868928:web:7486aa7e590e667c5a2165",
  measurementId: "G-1PTVSBZ8MG",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    tag: payload.data.url || "default-tag",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("message", (event) => {
  const { type, data } = event.data;
  if (type === "showNotification") {
    const { title, body } = data;
    self.registration.showNotification(title, {
      body: body,
      icon: "/logo-multidiag.png",
      tag: data.url,
    });
    self.registration.showNotification(title);
  }
});
