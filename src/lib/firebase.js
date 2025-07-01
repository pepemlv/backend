//src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Realtime Database
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNJQ5rKci64Ni1UFym6QSgwHDhWMyQTMc",
    authDomain: "techtracknative.firebaseapp.com",
    databaseURL: "https://techtracknative-default-rtdb.firebaseio.com",
    projectId: "techtracknative",
    storageBucket: "techtracknative.appspot.com",
    messagingSenderId: "749519080715",
    appId: "1:749519080715:web:f0689782d88552dc33660e"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

// Conditionally initialize Analytics
let analytics;
isSupported().then(supported => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

// Export
export { app, analytics, db, auth, realtimeDb };