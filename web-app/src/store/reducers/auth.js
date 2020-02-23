/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/auth.js
// Description: Redux auth reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

// Initial Redux auth state
const initialState = {
    isAuthenticated: null, // null value means that auth handler has not yet run
    isAuthFlowComplete: null, // null value means that auth flow was never started
    error: null,
    showWelcomePage: false,
    usersName: null,
    usersPictureUrl: null
};

/**
 * Updates Redux auth state based on an action type and a payload
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 */
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_AUTH_FLOW:
            return updateObject(state, { isAuthFlowComplete: false });
        case actionTypes.AUTH_FLOW_COMPLETE:
            if (action.showWelcomePage) {
                // Immediately show the welcome page
                return updateObject(state, { isAuthFlowComplete: true, showWelcomePage: true });
            } else {
                // Doesn't set showWelcomePage to false in case the user has not verified their email (in that case we still want to show the welcome page)
                return updateObject(state, { isAuthFlowComplete: true });
            }
        case actionTypes.RETRIEVED_USERS_NAME:
            return updateObject(state, { usersName: action.name });
        case actionTypes.USERS_NAME_RETRIEVAL_FAILED:
            return updateObject(state, { usersName: null });
        case actionTypes.RETRIEVED_USERS_PICTURE_URL:
            return updateObject(state, { usersPictureUrl: action.url });
        case actionTypes.USERS_PICTURE_URL_RETRIEVAL_FAILED:
            return updateObject(state, { usersPictureUrl: null });
        case actionTypes.USER_AUTHENTICATED:
            if (state.isAuthFlowComplete === null) {
                // Auth flow is not needed (user is already signed in)
                return updateObject(state, {
                    isAuthenticated: true,
                    error: null,
                    isAuthFlowComplete: true
                });
            } else {
                return updateObject(state, { isAuthenticated: true, error: null });
            }
        case actionTypes.USER_NOT_AUTHENTICATED:
            return updateObject(state, { isAuthenticated: false, error: null });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, { error: action.error });
        case actionTypes.SHOW_WELCOME_PAGE:
            return updateObject(state, { showWelcomePage: true });
        case actionTypes.DO_NOT_SHOW_WELCOME_PAGE:
            return updateObject(state, { showWelcomePage: false });
        case actionTypes.WELCOME_PAGE_COMPLETE:
            return updateObject(state, { showWelcomePage: false });
        case actionTypes.SIGN_OUT:
            return state;
        default:
            return state;
    }
};

export default authReducer;
