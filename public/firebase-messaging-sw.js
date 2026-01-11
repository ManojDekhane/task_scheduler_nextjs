importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD1145GZJyZUaFAa_a57a0BPJPUCNG3TlU",
  projectId: "taskschedulernext-44e5a",
  messagingSenderId: "729756335312",
  appId: "1:729756335312:web:2107fbd537dad05038b2d5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon_192.png"
  });
});
