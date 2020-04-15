// NPM module imports
import "firebase/storage";

// File imports
import * as actionTypes from "./actionTypes";
import firebase from "../../vendors/Firebase/firebase";
import { authError as logAuthError } from "../../vendors/Firebase/logs";
import { setAxiosAuthToken, getUser } from "../../vendors/AWS/tmaApi";

/**
 * Redux authentication actions
 * @module reduxAuthActions
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Signs the current user out
 * @function
 * @returns {function} A React Redux dispatch function
 */
export const signOut = () => {
    return (dispatch) => {
        // Don't show the welcome page
        dispatch(doNotShowWelcomePage());

        // Signs the user out
        firebase
            .auth()
            .signOut()
            .then(() => {
                // Successful sign out
                dispatch(signOutSuccess());
            })
            .catch((error) => {
                // Error when signing out
                dispatch(authError(error));
            });
    };
};

/**
 * Updates redux state whenever Firebase Auth state changes
 * @function
 * @returns {function} A React Redux dispatch function
 */
export const handleAuthStateChanges = () => {
    return (dispatch) => {
        // Creates an auth state changed observer
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

/**
 * Gets user info, including the users full name and a profile picture
 * @function
 * @returns {function} A React Redux dispatch function
 */
export const getUserInfo = () => {
    return (dispatch) => {
        // Gets the current user
        let user = firebase.auth().currentUser;

        if (user) {
            // Gets the user from the database
            getUser()
                .then((snapshot) => {
                    // Update state with the user's full name
                    dispatch(
                        retrievedUsersName(
                            snapshot.data.first_name +
                                " " +
                                snapshot.data.last_name
                        )
                    );

                    // The user has been authenticated
                    dispatch(userAuthenticated());

                    // Returns has_picture boolean
                    return snapshot.data.has_picture;
                })
                .catch((error) => {
                    // Error getting the user info
                    dispatch(authError(error));
                    dispatch(usersNameRetrievalFailed());

                    // Log an error
                    logAuthError(
                        error.response.status,
                        error.response.data,
                        "[store/actions/auth/getUserInfo]"
                    );
                })
                .then((userHasProfilePicture) => {
                    if (userHasProfilePicture) {
                        // Get the user's profile picture URL
                        return firebase
                            .storage()
                            .ref()
                            .child(`users/${user.uid}/profile_picture_200x200`)
                            .getDownloadURL();
                    }
                })
                .then((url) => {
                    // Updates state with the picture URL
                    dispatch(retrievedUsersPictureUrl(url));
                })
                .catch((error) => {
                    // Error getting the picture url
                    dispatch(authError(error));
                    dispatch(usersPictureUrlRetrievalFailed());
                });
        }
    };
};

/**
 * Return object for the startAuthFlow function
 * @typedef StartAuthFlowReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {module:authFlows} flow - The current auth flow
 */

/**
 * Starts the auth flow
 * @function
 * @returns {module:reduxAuthActions~StartAuthFlowReturnObject}
 */
export const startAuthFlow = (flow) => {
    return {
        type: actionTypes.START_AUTH_FLOW,
        flow,
    };
};

/**
 * Return object for the changeAuthFlow function
 * @typedef ChangeAuthFlowReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {module:authFlows} flow - The current auth flow to change to
 */

/**
 * Changes the auth flow
 * @function
 * @returns {module:reduxAuthActions~ChangeAuthFlowReturnObject}
 */
export const changeAuthFlow = (flow) => {
    return {
        type: actionTypes.CHANGE_AUTH_FLOW,
        flow,
    };
};

/**
 * Return object for the showWelcomePage function
 * @typedef ShowWelcomePageReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {boolean} isAuthFlowComplete - Indicates if the auth flow is complete
 */

/**
 * Shows the welcome page.
 * If the auth flow is complete, the welcome page will show immediately.
 * Otherwise, the welcome page will show once the auth flow is complete.
 * @function
 * @param {boolean} isAuthFlowComplete - Indicates if the auth flow is complete
 * @returns {module:reduxAuthActions~ShowWelcomePageReturnObject}
 */
export const showWelcomePage = (isAuthFlowComplete) => {
    return {
        type: actionTypes.SHOW_WELCOME_PAGE,
        isAuthFlowComplete,
    };
};

/**
 * Return object for the doNotShowWelcomePage function
 * @typedef DoNotShowWelcomePageReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Does not show the welcome page
 * @function
 * @returns {module:reduxAuthActions~DoNotShowWelcomePageReturnObject}
 */
export const doNotShowWelcomePage = () => {
    return {
        type: actionTypes.DO_NOT_SHOW_WELCOME_PAGE,
    };
};

/**
 * Return object for the welcomePageComplete function
 * @typedef WelcomePageCompleteReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Hides (i.e. removes) the welcome page
 * @function
 * @returns {module:reduxAuthActions~WelcomePageCompleteReturnObject}
 */
export const welcomePageComplete = () => {
    return {
        type: actionTypes.WELCOME_PAGE_COMPLETE,
    };
};

/**
 * Return object for the userAuthenticated function
 * @typedef UserAuthenticatedReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the user is authenticated
 * @function
 * @returns {module:reduxAuthActions~UserAuthenticatedReturnObject}
 */
const userAuthenticated = () => {
    return {
        type: actionTypes.USER_AUTHENTICATED,
    };
};

/**
 * Return object for the userNotAuthenticated function
 * @typedef UserNotAuthenticatedReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the user is not authenticated
 * @function
 * @returns {module:reduxAuthActions~UserNotAuthenticatedReturnObject}
 */
const userNotAuthenticated = () => {
    return {
        type: actionTypes.USER_NOT_AUTHENTICATED,
    };
};

/**
 * Return object for the authError function
 * @typedef AuthErrorReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {object} error - The auth error
 */

/**
 * Sets the auth error to the given error
 * @function
 * @param {object} error - The auth error
 * @returns {module:reduxAuthActions~AuthErrorReturnObject}
 */
const authError = (error) => {
    return {
        type: actionTypes.AUTH_ERROR,
        error,
    };
};

/**
 * Return object for the signOutSuccess function
 * @typedef SignOutSuccessReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the sign out was successful
 * @function
 * @returns {module:reduxAuthActions~SignOutSuccessReturnObject}
 */
const signOutSuccess = () => {
    return {
        type: actionTypes.SIGN_OUT,
    };
};

/**
 * Return object for the retrievedUsersName function
 * @typedef RetrievedUsersNameReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {string} name - The user's name
 */

/**
 * Sets the user's name
 * @function
 * @param {string} name - The user's name
 * @returns {module:reduxAuthActions~RetrievedUsersNameReturnObject}
 */
const retrievedUsersName = (name) => {
    return {
        type: actionTypes.RETRIEVED_USERS_NAME,
        name,
    };
};

/**
 * Return object for the usersNameRetrievalFailed function
 * @typedef UsersNameRetrievalFailedReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the retrieval of the user's name failed
 * @function
 * @returns {module:reduxAuthActions~UsersNameRetrievalFailedReturnObject}
 */
const usersNameRetrievalFailed = () => {
    return {
        type: actionTypes.USERS_NAME_RETRIEVAL_FAILED,
    };
};

/**
 * Return object for the retrievedUsersPictureUrl function
 * @typedef RetrievedUsersPictureUrlReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {string} url - The profile picture url
 */

/**
 * Sets the user's profile picture URL
 * @function
 * @param {string} url - The profile picture url
 * @returns {module:reduxAuthActions~RetrievedUsersPictureUrlReturnObject}
 */
const retrievedUsersPictureUrl = (url) => {
    return {
        type: actionTypes.RETRIEVED_USERS_PICTURE_URL,
        url,
    };
};

/**
 * Return object for the usersPictureUrlRetrievalFailed function
 * @typedef {object} UsersPictureUrlRetrievalFailedReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the retrieval of the user's profile picture url failed
 * @function
 * @returns {module:reduxAuthActions~UsersPictureUrlRetrievalFailedReturnObject}
 */
const usersPictureUrlRetrievalFailed = () => {
    return {
        type: actionTypes.USERS_PICTURE_URL_RETRIEVAL_FAILED,
    };
};
