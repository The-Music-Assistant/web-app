// NPM module imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/performance";

/**
 * Initializes Firebase
 * @module firebase
 * @category Firebase
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Firebase app config object.
 * All property values come from Firebase.
 * Property values must be put into the .env file for security.
 * @property {string} apiKey
 * @property {string} authDomain
 * @property {string} databaseURL
 * @property {string} projectId
 * @property {string} storageBucket
 * @property {string} messagingSenderId
 * @property {string} appId
 * @property {string} measurementId
 */
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initializes the Firebase app
firebase.initializeApp(firebaseConfig);

// Initializes Firebase Analytics
firebase.analytics();

// Initializes Firebase Performance Monitoring
firebase.performance();

export default firebase;
