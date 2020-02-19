/* ----------------------------------------------------------------------------
// File Path: src/store/actions/auth.js
// Description: Authentication Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// File imports
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
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // Sets the Axios auth header with the user's id token
                firebase
                    .auth()
                    .currentUser.getIdToken()
                    .then(setAxiosAuthToken)
                    .then(() => {
                        dispatch(userAuthenticated());
                    })
                    .then(() => {
                        // A user must have a verified email before they can use the app
                        // The welcome page blocks the user until they verify their email
                        if (!user.emailVerified) {
                            dispatch(showWelcomePage());
                        }
                    })
                    .catch(error => {
                        // Clears the old Axios auth header token if there is one
                        setAxiosAuthToken("");
                        dispatch(authError(error));
                        console.log("[actions/auth/handleAuthStateChanges]", error);
                    });
            } else {
                // Clears the old Axios auth header token if there is one
                setAxiosAuthToken("");
                dispatch(userNotAuthenticated());
            }
        });
    };
};

/**
 * Returns START_AUTH_FLOW action type
 */
export const startAuthFlow = () => {
    return {
        type: actionTypes.START_AUTH_FLOW
    };
};

/**
 * Returns AUTH_FLOW_COMPLETE action type and a boolean indicating whether or not to show the welcome page
 */
export const authFlowComplete = showWelcomePage => {
    return {
        type: actionTypes.AUTH_FLOW_COMPLETE,
        showWelcomePage
    };
};

/**
 * Returns WELCOME_PAGE_START action type
 */
export const showWelcomePage = () => {
    return {
        type: actionTypes.SHOW_WELCOME_PAGE
    };
};

/**
 * Returns WELCOME_PAGE_COMPLETE action type
 */
export const welcomePageComplete = () => {
    return {
        type: actionTypes.WELCOME_PAGE_COMPLETE
    };
};

/**
 * Returns USER_AUTHENTICATED action type and a boolean indicating whether or not the auth flow is complete
 */
const userAuthenticated = isAuthFlowComplete => {
    return {
        type: actionTypes.USER_AUTHENTICATED,
        isAuthFlowComplete
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
