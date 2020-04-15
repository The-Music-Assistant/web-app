// NPM module imports
import firebase from "./firebase.js";

/**
 * Pre-built logs for Firebase Analytics
 * @module firebaseLogs
 * @category Firebase
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Logs an authentication error
 * @function
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @param {string} location - The error location
 */
export const authError = (code, message, location) =>
    logEvent("auth_error", code, message, location);

/**
 * Logs a choir selection error
 * @function
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @param {string} location - The error location
 */
export const choirSelectionError = (code, message, location) =>
    logEvent("choir_selection_error", code, message, location);

/**
 * Logs a music selection error
 * @function
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @param {string} location - The error location
 */
export const musicSelectionError = (code, message, location) =>
    logEvent("music_selection_error", code, message, location);

/**
 * Logs a sheet music error
 * @function
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @param {string} location - The error location
 */
export const sheetMusicError = (code, message, location) =>
    logEvent("sheet_music_error", code, message, location);

/**
 * Logs a choir members error
 * @function
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @param {string} location - The error location
 */
export const choirMembersError = (code, message, location) =>
    logEvent("choir_members_error", code, message, location);

/**
 * Logs an event
 * @function
 * @param {string} eventType - The event type
 * @param {string} code - The error code
 * @param {string} message - The error message
 * @param {string} location - The error location
 */
const logEvent = (eventType, code, message, location) => {
    // Logs the event to Firebase Analytics
    firebase.analytics().logEvent(eventType, {
        errorCode: code,
        errorMessage: message,
        errorLocation: location,
    });
};
