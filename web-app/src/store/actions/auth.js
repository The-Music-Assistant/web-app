/* ----------------------------------------------------------------------------
// File Path: src/store/actions/auth.js
// Description: Authentication Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// NPM module imports
import "firebase/storage";

// File imports
import * as actionTypes from "./actionTypes";
import firebase from "../../vendors/Firebase/firebase";
import { authError as logAuthError } from "../../vendors/Firebase/logs";
import { setAxiosAuthToken, getUser } from "../../vendors/AWS/tmaApi";

/**
 * Signs the current user out
 */
export const signOut = () => {
    return (dispatch) => {
        dispatch(doNotShowWelcomePage());
        firebase
            .auth()
            .signOut()
            .then(() => {
                dispatch(signOutSuccess());
            })
            .catch((error) => {
                dispatch(authError(error));
            });
    };
};

/**
 * Updates redux state whenever Firebase Auth state changes
 */
export const handleAuthStateChanges = () => {
    return (dispatch) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Sets the Axios auth header with the user's id token
                firebase
                    .auth()
                    .currentUser.getIdToken()
                    .then(setAxiosAuthToken)
                    .catch((error) => {
                        // Clears the old Axios auth header token if there is one
                        setAxiosAuthToken("");
                        dispatch(authError(error));
                        logAuthError(
                            error.code,
                            error.message,
                            "[store/actions/auth/handleAuthStateChanges]"
                        );
                    })
                    .then(() => {
                        dispatch(getUserInfo());
                    })
                    .then(() => {
                        // A user must have a verified email before they can use the app
                        // The welcome page blocks the user until they verify their email
                        if (!user.emailVerified) {
                            dispatch(showWelcomePage());
                        }
                    });
            } else {
                // Clears the old Axios auth header token if there is one
                setAxiosAuthToken("");
                dispatch(userNotAuthenticated());
            }
        });
    };
};

export const getUserInfo = () => {
    return (dispatch) => {
        let user = firebase.auth().currentUser;
        if (user) {
            getUser()
                .then((snapshot) => {
                    dispatch(
                        retrievedUsersName(snapshot.data.first_name + " " + snapshot.data.last_name)
                    );
                    dispatch(userAuthenticated());

                    return snapshot.data.has_picture;
                })
                .catch((error) => {
                    dispatch(authError(error));
                    dispatch(usersNameRetrievalFailed());
                    logAuthError(
                        error.response.status,
                        error.response.data,
                        "[store/actions/auth/getUserInfo]"
                    );
                })
                .then((userHasProfilePicture) => {
                    if (userHasProfilePicture) {
                        return firebase
                            .storage()
                            .ref()
                            .child(`users/${user.uid}/profile_picture_200x200`)
                            .getDownloadURL();
                    }
                })
                .then((url) => {
                    dispatch(retrievedUsersPictureUrl(url));
                })
                .catch((error) => {
                    dispatch(authError(error));
                    dispatch(usersPictureUrlRetrievalFailed());
                });
        }
    };
};

/**
 * Returns START_AUTH_FLOW action type and the type of flow that was started
 */
export const startAuthFlow = (flow) => {
    return {
        type: actionTypes.START_AUTH_FLOW,
        flow,
    };
};

/**
 * Returns CHANGE_AUTH_FLOW action type and the type of flow that was started
 */
export const changeAuthFlow = (flow) => {
    return {
        type: actionTypes.CHANGE_AUTH_FLOW,
        flow,
    };
};

/**
 * Returns WELCOME_PAGE_START action type and a boolean indicating if the auth flow is complete
 */
export const showWelcomePage = (isAuthFlowComplete) => {
    return {
        type: actionTypes.SHOW_WELCOME_PAGE,
        isAuthFlowComplete,
    };
};

/**
 * Returns DO_NOT_SHOW_WELCOME_PAGE action type
 */
export const doNotShowWelcomePage = () => {
    return {
        type: actionTypes.DO_NOT_SHOW_WELCOME_PAGE,
    };
};

/**
 * Returns WELCOME_PAGE_COMPLETE action type
 */
export const welcomePageComplete = () => {
    return {
        type: actionTypes.WELCOME_PAGE_COMPLETE,
    };
};

/**
 * Returns USER_AUTHENTICATED action type
 */
const userAuthenticated = () => {
    return {
        type: actionTypes.USER_AUTHENTICATED,
    };
};

/**
 * Returns USER_NOT_AUTHENTICATED action type
 */
const userNotAuthenticated = () => {
    return {
        type: actionTypes.USER_NOT_AUTHENTICATED,
    };
};

/**
 * Returns AUTH_ERROR action type and the error
 * @param {string} error
 */
const authError = (error) => {
    return {
        type: actionTypes.AUTH_ERROR,
        error,
    };
};

/**
 * Returns SIGN_OUT action type
 */
const signOutSuccess = () => {
    return {
        type: actionTypes.SIGN_OUT,
    };
};

/**
 * Returns RETRIEVED_USERS_NAME action type and the user's full name
 */
const retrievedUsersName = (name) => {
    return {
        type: actionTypes.RETRIEVED_USERS_NAME,
        name,
    };
};

/**
 * Returns USERS_NAME_RETRIEVAL_FAILED action type
 */
const usersNameRetrievalFailed = () => {
    return {
        type: actionTypes.USERS_NAME_RETRIEVAL_FAILED,
    };
};

/**
 * Returns RETRIEVED_USERS_PICTURE_URL action type and the user's picture url
 */
const retrievedUsersPictureUrl = (url) => {
    return {
        type: actionTypes.RETRIEVED_USERS_PICTURE_URL,
        url,
    };
};

/**
 * Returns USERS_PICTURE_URL_RETRIEVAL_FAILED action type
 */
const usersPictureUrlRetrievalFailed = () => {
    return {
        type: actionTypes.USERS_PICTURE_URL_RETRIEVAL_FAILED,
    };
};
