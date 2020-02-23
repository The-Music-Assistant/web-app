/* ----------------------------------------------------------------------------
// File Path: src/store/actions/actionTypes.js
// Description: Sets up Redux action constants
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// Auth action types
export const USER_AUTHENTICATED = "USER_AUTHENTICATED";
export const USER_NOT_AUTHENTICATED = "USER_NOT_AUTHENTICATED";

export const RETRIEVED_USERS_NAME = "RETRIEVED_USERS_NAME";
export const USERS_NAME_RETRIEVAL_FAILED = "USERS_NAME_RETRIEVAL_FAILED";

export const RETRIEVED_USERS_PICTURE_URL = "RETRIEVED_USERS_PICTURE_URL";
export const USERS_PICTURE_URL_RETRIEVAL_FAILED = "USERS_PICTURE_URL_RETRIEVAL_FAILED";

export const SIGN_OUT = "SIGN_OUT";

export const START_AUTH_FLOW = "START_AUTH_FLOW";
export const AUTH_FLOW_COMPLETE = "AUTH_FLOW_COMPLETE";

export const SHOW_WELCOME_PAGE = "SHOW_WELCOME_PAGE";
export const DO_NOT_SHOW_WELCOME_PAGE = "DO_NOT_SHOW_WELCOME_PAGE";
export const WELCOME_PAGE_COMPLETE = "WELCOME_PAGE_COMPLETE";

export const AUTH_ERROR = "AUTH_ERROR";


// Startup action types
export const STARTUP_DONE = "STARTUP_DONE";
