/* ----------------------------------------------------------------------------
// File Path: src/store/actions/auth.js
// Description:
    * Authentication Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "./actionTypes";
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
            .then(() => {
                const error = sendVerificationEmail();
                if (error) {
                    dispatch(authError());
                } else {
                    dispatch(authSuccess());
                }
            })
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
                    .then(() => {
                        dispatch(authSuccess());
                    })
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
            .catch(() => {
                dispatch(authError());
            });
    };
};

/**
 * Sends a verification email
 * @returns An error if one exists; otherwise returns null
 */
export const sendVerificationEmail = async () => {
    try {
        await firebase.auth().currentUser.sendEmailVerification();
        return null;
    } catch (error) {
        return error;
    }
};

/**
 * Sends a password reset email
 * @returns An error if one exists; otherwise returns null
 */
export const sendPasswordResetEmail = email => {
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
 * TODO: Check to make sure this works (it might not update Redux properly)
 */
export const handleAuthStateChanges = () => {
    return dispatch => {
        dispatch(authLoading())
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Checks if user's email is verified
                dispatch(authSuccess());
                // if (user.emailVerified) {
                //     // Dispatches success if email is verified
                //     dispatch(authSuccess());
                // } else {
                //     // Dispatches an error if email is not verified
                //     dispatch(authError("User's email is not verified"));
                // }
            } else {
                // If no user exists, signs the user out
                dispatch(signOut());
            }
        });
    };
};

/**
 * Returns AUTH_LOADING action type
 */
export const authLoading = () => {
    return {
        type: actionTypes.AUTH_LOADING
    };
};

/**
 * Returns AUTH_SUCCESS action type
 */
export const authSuccess = () => {
    return {
        type: actionTypes.AUTH_SUCCESS
    };
};

/**
 * Returns SIGN_OUT_SUCCESS action type
 */
export const signOutSuccess = () => {
    return {
        type: actionTypes.SIGN_OUT_SUCCESS
    };
};

/**
 * Returns PASSWORD_RESET_SENT action type
 */
export const passwordResetSent = () => {
    return {
        type: actionTypes.PASSWORD_RESET_SENT
    };
};

/**
 * Returns AUTH_ERROR action type and the error
 * @param {string} error
 */
export const authError = error => {
    return {
        type: actionTypes.AUTH_ERROR,
        error
    };
};

export const authFlowPageChange = pageName => {
    return {
        type: actionTypes.AUTH_FLOW_PAGE_CHANGED,
        pageName
    }
}
