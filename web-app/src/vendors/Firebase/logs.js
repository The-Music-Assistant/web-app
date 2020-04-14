// ----------------------------------------------------------------------------
// File Path: src/vendors/Firebase/log.js
// Description: Pre-built logs for Firebase Analytics
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/26/2020
// ----------------------------------------------------------------------------

/**
 * Pre-built logs for Firebase Analytics
 * @module logs
 * @author Dan Levy <danlevy124@gmail.com>
 */

// NPM module imports
import firebase from "./firebase.js";

export const authError = (code, message, location) =>
    logEvent("auth_error", code, message, location);

export const choirSelectionError = (code, message, location) =>
    logEvent("choir_selection_error", code, message, location);

export const musicSelectionError = (code, message, location) =>
    logEvent("music_selection_error", code, message, location);

export const sheetMusicError = (code, message, location) =>
    logEvent("sheet_music_error", code, message, location);

export const choirMembersError = (code, message, location) =>
    logEvent("choir_members_error", code, message, location);

const logEvent = (eventType, code, message, location) => {
    firebase.analytics().logEvent(eventType, {
        errorCode: code,
        errorMessage: message,
        errorLocation: location,
    });
};
