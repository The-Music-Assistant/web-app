/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/auth.js
// Description: Authentication Redux reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    isAuthenticated: null,
    authFlowComplete: null,
    error: null,
    firstName: null,
    showWelcomePage: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_FLOW_COMPLETE:
            if (action.showWelcomePage) {
                return updateObject(state, { authFlowComplete: true, showWelcomePage: true });
            } else {
                // Doesn't set showWelcomePage to false in case the user has not verified their email (in that case we still want to show the welcome page)
                return updateObject(state, { authFlowComplete: true });
            }
        case actionTypes.START_AUTH_FLOW:
            return updateObject(state, { authFlowComplete: false });
        case actionTypes.SHOW_WELCOME_PAGE:
            return updateObject(state, { showWelcomePage: true });
        case actionTypes.WELCOME_PAGE_COMPLETE:
            return updateObject(state, { showWelcomePage: false });
        case actionTypes.USER_AUTHENTICATED:
            if (state.authFlowComplete === null) {
                return updateObject(state, { isAuthenticated: true, error: null, authFlowComplete: true });
            } else {
                return updateObject(state, { isAuthenticated: true, error: null });
            }
        case actionTypes.USER_NOT_AUTHENTICATED:
            return updateObject(state, { isAuthenticated: false, error: null });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, {
                isAuthenticated: false,
                error: action.error,
                isLoading: false
            });
        case actionTypes.SIGN_OUT:
            return state;
        default:
            return state;
    }
};

export default authReducer;
