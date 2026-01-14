
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyD-i0lmZQrHQei-RZJlUX6zqWrHP5DWfYA",
    authDomain: "lovethepadel.firebaseapp.com",
    projectId: "lovethepadel",
    storageBucket: "lovethepadel.firebasestorage.app",
    messagingSenderId: "716538254208",
    appId: "1:716538254208:web:883ca40ac31b5aed93e765",
    measurementId: "G-13WM2V91CC"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon,
    });
})