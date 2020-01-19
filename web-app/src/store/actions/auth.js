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

/**
 * Signs the user in with an email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {boolean} stayAuthenticated - Whether or not to hold auth state when the session ends
 */
export const signInWithEmailPassword = (email, password, stayAuthenticated) => {
    return dispatch => {
        dispatch(authLoading());

        const persistenceType = stayAuthenticated
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;

        // Sets the persistence for Firebase Auth
        firebase
            .auth()
            .setPersistence(persistenceType)
            .then(() => {
                // Once persistence is set, signs the user in
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .catch(error => {
                        dispatch(authError(error));
                    });
            })
            .catch(error => {
                // If setting the persistence failed, retrieve the error
                dispatch({ type: actionTypes.AUTH_ERROR, error });
            });
    };
};

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
                dispatch(authSuccess(true));
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

/**
 * Returns BEGIN_SIGN_UP action type
 */
export const beginSignUp = () => {
    return {
        type: actionTypes.BEGIN_SIGN_UP
    };
};

/**
 * Returns END_SIGN_UP action type
 */
export const endSignUp = () => {
    return {
        type: actionTypes.END_SIGN_UP
    };
};
