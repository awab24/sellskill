importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFH7SrOXpxr5o3O25lE-tBtXKDTpUKOzQ",
    authDomain: "sell-skill-79ed7.firebaseapp.com",
    projectId: "sell-skill-79ed7",
    storageBucket: "sell-skill-79ed7.appspot.com",
    messagingSenderId: "454122967288",
    appId: "1:454122967288:web:1150ef291cef6f98766b0d",
    measurementId: "G-ZC5R2NKGQZ",
  };
  

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message", payload);
  
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
