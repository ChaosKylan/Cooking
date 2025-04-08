import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use

import {
    getAuth,
    signInWithCredential,
    GoogleAuthProvider,
} from "firebase/auth";
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
} from "@env";

// Initialize Firebase
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export { auth };
