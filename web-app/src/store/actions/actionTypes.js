/**
 * Redux action types.
 * Treat this file as an enum.
 * @module reduxActionTypes
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

// --------------- App action types ---------------
/**
 * @type {string}
 */
export const IS_MOBILE_BROWSER = "IS_MOBILE_BROWSER";

// --------------- Auth action types ---------------
/**
 * @type {string}
 */
export const USER_AUTHENTICATED = "USER_AUTHENTICATED";
/**
 * @type {string}
 */
export const USER_NOT_AUTHENTICATED = "USER_NOT_AUTHENTICATED";
/**
 * @type {string}
 */
export const RETRIEVED_USERS_NAME = "RETRIEVED_USERS_NAME";
/**
 * @type {string}
 */
export const USERS_NAME_RETRIEVAL_FAILED = "USERS_NAME_RETRIEVAL_FAILED";
/**
 * @type {string}
 */
export const RETRIEVED_USERS_PICTURE_URL = "RETRIEVED_USERS_PICTURE_URL";
/**
 * @type {string}
 */
export const USERS_PICTURE_URL_RETRIEVAL_FAILED =
    "USERS_PICTURE_URL_RETRIEVAL_FAILED";
/**
 * @type {string}
 */
export const SIGN_OUT = "SIGN_OUT";
/**
 * @type {string}
 */
export const START_AUTH_FLOW = "START_AUTH_FLOW";
/**
 * @type {string}
 */
export const CHANGE_AUTH_FLOW = "CHANGE_AUTH_FLOW";
/**
 * @type {string}
 */
export const SHOW_WELCOME_PAGE = "SHOW_WELCOME_PAGE";
/**
 * @type {string}
 */
export const DO_NOT_SHOW_WELCOME_PAGE = "DO_NOT_SHOW_WELCOME_PAGE";
/**
 * @type {string}
 */
export const WELCOME_PAGE_COMPLETE = "WELCOME_PAGE_COMPLETE";
/**
 * @type {string}
 */
export const AUTH_ERROR = "AUTH_ERROR";

// --------------- Startup action types ---------------
/**
 * @type {string}
 */
export const STARTUP_DONE = "STARTUP_DONE";

// --------------- Practice action types ---------------
/**
 * @type {string}
 */
export const PRACTICE_CHOIR_SELECTED = "PRACTICE_CHOIR_SELECTED";
/**
 * @type {string}
 */
export const PRACTICE_SONG_SELECTED = "PRACTICE_SONG_SELECTED";
/**
 * @type {string}
 */
export const EXERCISE_REQUESTED = "EXERCISE_REQUESTED";
/**
 * @type {string}
 */
export const EXERCISE_GENERATED = "EXERCISE_GENERATED";
/**
 * @type {string}
 */
export const USER_GETS_FEEDBACK = "USER_GETS_FEEDBACK";
/**
 * @type {string}
 */
export const USER_DOES_NOT_GET_FEEDBACK = "USER_DOES_NOT_GET_FEEDBACK";

// --------------- Choirs action types ---------------
/**
 * @type {string}
 */
export const CHOIRS_CHOIR_SELECTED = "CHOIRS_CHOIR_SELECTED";
