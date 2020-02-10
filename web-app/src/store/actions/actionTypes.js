/* ----------------------------------------------------------------------------
// File Path: src/store/actions/actionTypes.js
// Description: Sets up Redux action constants
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// Startup action types
export const STARTUP_AUTH_DONE = "STARTUP_AUTH_DONE";

// Auth action types
export const AUTH_LOADING = "AUTH_LOADING";
export const START_SIGN_IN = "START_SIGN_IN";
export const START_SIGN_UP = "START_SIGN_UP";
export const END_SIGN_IN = "END_SIGN_IN";
export const END_SIGN_UP = "END_SIGN_UP";
export const USER_EXISTS = "USER_EXISTS";
export const NO_USER_EXISTS = "NO_USER_EXISTS";
export const AUTH_ERROR = "AUTH_ERROR";
export const FIRST_NAME_ENTERED = "FIRST_NAME_ENTERED";
export const END_WELCOME_PAGE = "END_WELCOME_PAGE";
