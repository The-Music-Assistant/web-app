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
        firebase.auth().signOut();
        firebase.auth().onAuthStateChanged(user => {
            dispatch(startAuthLoading());
            if (user) {
                firebase
                    .auth()
                    .currentUser.getIdToken()
                    .then(setAxiosAuthToken)
                    .catch(error => console.log(error))
                    .finally(() => {
                        dispatch(userExists());
                        dispatch(endAuthLoading());
                    });
            } else {
                dispatch(noUserExists());
                dispatch(endAuthLoading());
            }
        });
    };
};

/**
 * Returns START_AUTH_LOADING action type
 */
const startAuthLoading = () => {
    return {
        type: actionTypes.START_AUTH_LOADING
    };
};

/**
 * Returns END_AUTH_LOADING action type
 */
const endAuthLoading = () => {
    return {
        type: actionTypes.END_AUTH_LOADING
    };
};

/**
 * Returns USER_EXISTS action type
 */
const userExists = () => {
    return {
        type: actionTypes.USER_EXISTS
    }
};

/**
 * Returns NO_USER_EXISTS action type
 */
const noUserExists = () => {
    return {
        type: actionTypes.NO_USER_EXISTS
    }
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
