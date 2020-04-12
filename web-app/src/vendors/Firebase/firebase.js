/* ----------------------------------------------------------------------------
// File Path: src/vendors/Firebase/firebase.js
// Description: Initializes Firebase
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/1/2020
---------------------------------------------------------------------------- */

// NPM module imports
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/performance";

/*
 * Firebase app config object
 * Variables are in the .env file for security
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
