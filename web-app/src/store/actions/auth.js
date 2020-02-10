/* ----------------------------------------------------------------------------
// File Path: src/store/actions/auth.js
// Description: Authentication Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "./actionTypes";
import { store } from "../reduxSetup";
import firebase from "../../vendors/Firebase/firebase";
import { setAxiosAuthToken } from "../../App/musicAssistantApi";

/**
 * Signs the current user out
 */
// export const signOut = () => {
//     return dispatch => {
//         dispatch(authLoading());
//         firebase
//             .auth()
//             .signOut()
//             .then(() => {
//                 dispatch(signOutSuccess());
//             })
//             .catch(error => {
//                 dispatch(authError(error));
//             });
//     };
// };

/**
 * Sends a password reset email
 * @returns An error if one exists; otherwise returns null
 */
// const sendPasswordResetEmail = email => {
//     return dispatch => {
//         firebase
//             .auth()
//             .sendPasswordResetEmail(email)
//             .then(() => {
//                 dispatch(passwordResetSent());
//             })
//             .catch(error => {
//                 dispatch(authError(error));
//             });
//     };
// };

/**
 * Updates redux state whenever Firebase Auth state changes
 * Sends an email verification if the user just signed up
 */
export const handleAuthStateChanges = () => {
    return dispatch => {
        dispatch(authLoading());
        // firebase.auth().signOut();
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase
                    .auth()
                    .currentUser.getIdToken()
                    .then(setAxiosAuthToken)
                    .finally(() => {
                        dispatch(authSuccess(true));
                    });
            } else {
                dispatch(authSuccess(false));
            }
            if (store.getState().startup.isStartingUp) {
                dispatch(startupAuthFinished());
            }
        });
    };
};

/**
 * Returns AUTH_LOADING action type
 */
const authLoading = () => {
    return {
        type: actionTypes.AUTH_LOADING
    };
};

/**
 * Returns USER_EXISTS action type
 */
const authSuccess = userExists => {
    let type = actionTypes.USER_EXISTS;
    if (!userExists) {
        type = actionTypes.NO_USER_EXISTS;
    }

    return {
        type
    };
};

/**
 * Returns AUTH_ERROR action type and the error
 * @param {string} error
 */
const authError = error => {
    console.log("ERROR", error);
    return {
        type: actionTypes.AUTH_ERROR,
        error
    };
};

/**
 * Returns STARTUP_AUTH_DONE action type
 */
const startupAuthFinished = () => {
    return {
        type: actionTypes.STARTUP_AUTH_DONE
    };
};

export const startSignIn = () => {
    return {
        type: actionTypes.START_SIGN_IN
    };
};

export const startSignUp = () => {
    return {
        type: actionTypes.START_SIGN_UP
    };
};

export const endSignIn = () => {
    return {
        type: actionTypes.END_SIGN_IN
    };
};

export const endSignUp = () => {
    return {
        type: actionTypes.END_SIGN_UP
    };
};

/**
 * Returns FIRST_NAME_ENTERED action type
 */
export const firstNameEntered = firstName => {
    return {
        type: actionTypes.FIRST_NAME_ENTERED,
        firstName
    };
};

/**
 * Returns END_WELCOME_PAGE action type
 */
export const endWelcomePage = () => {
    return {
        type: actionTypes.END_WELCOME_PAGE
    };
};
