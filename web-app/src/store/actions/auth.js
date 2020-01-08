/* ----------------------------------------------------------------------------
// File Path: src/store/actions/auth.js
// Description:
    * Authentication Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "./actionTypes";
import { store } from "../reduxSetup";
import firebase from "../../vendors/Firebase/firebase";

/**
 * Signs the user up with an email and password
 * Sends an email verification
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
export const signUpWithEmailPassword = (email, password) => {
    return dispatch => {
        dispatch(authLoading());

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => dispatch(shouldSendEmailVerification()))
            .catch(error => {
                dispatch(authError(error));
            });
    };
};

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
export const signOut = () => {
    return dispatch => {
        dispatch(authLoading());
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
 * Sends a password reset email
 * @returns An error if one exists; otherwise returns null
 */
const sendPasswordResetEmail = email => {
    return dispatch => {
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                dispatch(passwordResetSent());
            })
            .catch(error => {
                dispatch(authError(error));
            });
    };
};

/**
 * Updates redux state whenever Firebase Auth state changes
 * Sends an email verification if the user just signed up
 */
export const handleAuthStateChanges = () => {
    return dispatch => {
        dispatch(authLoading());
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Checks if user's email is verified
                dispatch(authSuccess(true));

                // Sends an email verification if needed
                if (store.getState().auth.sendEmailVerification) {
                    dispatch(sendEmailVerification());
                }

                // if (user.emailVerified) {
                //     // Dispatches success if email is verified
                //     dispatch(authSuccess());
                // } else {
                //     // Dispatches an error if email is not verified
                //     dispatch(authError("User's email is not verified"));
                // }
            } else {
                // If no user exists, signs the user out
                dispatch(authSuccess(false));
            }
        });
    };
};

/**
 * Sends an email verification to the current user
 */
const sendEmailVerification = user => {
    return dispatch => {
        dispatch(authLoading());
        firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
                dispatch(emailVerificationSent());
            })
            .catch(error => {
                dispatch(emailVerificationError(error));
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
 * Returns SEND_EMAIL_VERIFICATION action type
 */
const shouldSendEmailVerification = () => {
    return {
        type: actionTypes.SEND_EMAIL_VERIFICATION
    };
};

/**
 * Returns EMAIL_VERIFICATION_SENT action type
 */
const emailVerificationSent = () => {
    return {
        type: actionTypes.EMAIL_VERIFICATION_SENT
    }
}

/**
 * Returns EMAIL_VERIFICATION_ERROR action type
 */
const emailVerificationError = error => {
    return {
        type: actionTypes.EMAIL_VERIFICATION_ERROR,
        error
    }
}

/**
 * Returns SIGN_OUT_SUCCESS action type
 */
const signOutSuccess = () => {
    return {
        type: actionTypes.SIGN_OUT_SUCCESS
    };
};

/**
 * Returns PASSWORD_RESET_SENT action type
 */
const passwordResetSent = () => {
    return {
        type: actionTypes.PASSWORD_RESET_SENT
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

const authFlowPageChange = pageName => {
    return {
        type: actionTypes.AUTH_FLOW_PAGE_CHANGED,
        pageName
    };
};
