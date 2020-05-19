// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import * as authFlows from "../../pages/Auth/authFlows";

// TODO: Move isAuthenticted, userFullName, and userPictureUrl to global context

/**
 * Redux auth reducer
 * @module reduxAuthReducer
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Initial auth state
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated. Null value means that auth handler has not yet run.
 * @property {module:authFlows} authFlow - The current auth flow. Null value means that there is no auth flow currently happening.
 * @property {boolean} isAuthFlowComplete - Indicates if the current auth flow is complete. Null value means that there is no auth flow currently happening.
 * @property {object} error - Authentication error (if one exists)
 * @property {boolean} shouldShowWelcomePage - Indicates if the welcome page should be displayed
 * @property {string} usersName - The user's full name
 * @property {string} usersPictureUrl - The user's profile picture URL
 */
const initialState = {
    isAuthenticated: null,
    authFlow: null,
    isAuthFlowComplete: null,
    error: null,
    shouldShowWelcomePage: false,
    usersName: null,
    usersPictureUrl: null,
};

/**
 * Updates Redux auth state based on an action type and a payload
 * @function
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 * @returns {object} The new state
 */
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_AUTH_FLOW:
            return updateObject(state, {
                authFlow: action.flow,
                isAuthFlowComplete: false,
            });
        case actionTypes.CHANGE_AUTH_FLOW:
            return updateObject(state, { authFlow: action.flow });
        case actionTypes.RETRIEVED_USERS_NAME:
            return updateObject(state, { usersName: action.name });
        case actionTypes.USERS_NAME_RETRIEVAL_FAILED:
            return updateObject(state, { usersName: null });
        case actionTypes.RETRIEVED_USERS_PICTURE_URL:
            return updateObject(state, { usersPictureUrl: action.url });
        case actionTypes.USERS_PICTURE_URL_RETRIEVAL_FAILED:
            return updateObject(state, { usersPictureUrl: null });
        case actionTypes.USER_AUTHENTICATED:
            if (
                state.isAuthFlowComplete === null ||
                state.authFlow === authFlows.SIGN_IN
            ) {
                // An auth flow was never started or the auth flow is SIGN_IN, so the auth flow is complete
                return updateObject(state, {
                    isAuthenticated: true,
                    error: null,
                    isAuthFlowComplete: true,
                    authFlow: null,
                });
            } else {
                // The auth flow is SIGN_UP, so the auth flow is not yet complete
                return updateObject(state, {
                    isAuthenticated: true,
                    error: null,
                });
            }
        case actionTypes.USER_NOT_AUTHENTICATED:
            return updateObject(state, { isAuthenticated: false, error: null });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, { error: action.error });
        case actionTypes.SHOW_WELCOME_PAGE:
            if (action.isAuthFlowComplete) {
                return updateObject(state, {
                    shouldShowWelcomePage: true,
                    isAuthFlowComplete: true,
                    authFlow: null,
                });
            } else {
                return updateObject(state, {
                    shouldShowWelcomePage: true,
                });
            }

        case actionTypes.DO_NOT_SHOW_WELCOME_PAGE:
            return updateObject(state, { shouldShowWelcomePage: false });
        case actionTypes.WELCOME_PAGE_COMPLETE:
            return updateObject(state, { shouldShowWelcomePage: false });
        case actionTypes.SIGN_OUT:
            return state;
        default:
            return state;
    }
};

export default authReducer;
