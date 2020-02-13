/* ----------------------------------------------------------------------------
// File Path: src/store/actions/auth.js
// Description: Authentication Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "./actionTypes";
import firebase from "../../vendors/Firebase/firebase";
import { setAxiosAuthToken } from "../../App/musicAssistantApi";

/**
 * Signs the current user out
 */
export const signOut = () => {
    return dispatch => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                dispatch(signOutSuccess());
            })
            .catch(error => {
                dispatch(authError(error));
            });
    };
};

/**
 * Updates redux state whenever Firebase Auth state changes
 */
export const handleAuthStateChanges = () => {
    return dispatch => {
        // firebase.auth().signOut();
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(userAuthenticated());
                firebase
                    .auth()
                    .currentUser.getIdToken()
                    .then(setAxiosAuthToken)
                    .catch(error => {
                        dispatch(authError(error));
                        console.log("[actions/auth/handleAuthStateChanges]", error);
                    })
            } else {
                dispatch(userNotAuthenticated());
            }
        });
    };
};

/**
 * Returns USER_AUTHENTICATED action type
 */
const userAuthenticated = () => {
    return {
        type: actionTypes.USER_AUTHENTICATED
    };
};

/**
 * Returns USER_NOT_AUTHENTICATED action type
 */
const userNotAuthenticated = () => {
    return {
        type: actionTypes.USER_NOT_AUTHENTICATED
    };
};

/**
 * Returns AUTH_ERROR action type and the error
 * @param {string} error
 */
const authError = error => {
    return {
        type: actionTypes.AUTH_ERROR,
        error
    };
};

/**
 * Returns SIGN_OUT action type
 */
const signOutSuccess = () => {
    return {
        type: actionTypes.SIGN_OUT
    };
};
