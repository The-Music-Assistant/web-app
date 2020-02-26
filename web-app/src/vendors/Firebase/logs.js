// ----------------------------------------------------------------------------
// File Path: src/vendors/Firebase/log.js
// Description: Pre-built logs for Firebase Analytics
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/26/2020
// ----------------------------------------------------------------------------

// NPM module imports
import firebase from "./firebase.js";

export const authError = (code, message, location) => {
    firebase.analytics().logEvent("auth_error", {
        errorCode: code,
        errorMessage: message,
        errorLocation: location
    });
};

export const choirSelectionError = (code, message, location) => {
    firebase.analytics().logEvent("choir_selection_error", {
        errorCode: code,
        errorMessage: message,
        errorLocation: location
    });
};

export const sheetMusicError = (code, message, location) => {
    firebase.analytics().logEvent("sheet_music_error", {
        errorCode: code,
        errorMessage: message,
        errorLocation: location
    });
};
