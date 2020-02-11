/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/auth.js
// Description: Authentication Redux reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "../actions/actionTypes";
import * as authFlows from "../../pages/Auth/authFlows";
import { updateObject } from "../utility";

const initialState = {
    authFlow: null,
    isAuthenticated: false,
    error: null,
    isLoading: true,
    firstName: null,
    showWelcomePage: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_AUTH_LOADING:
            return updateObject(state, { isLoading: true });
        case actionTypes.END_AUTH_LOADING:
            return updateObject(state, { isLoading: false });
        case actionTypes.USER_EXISTS:
            return updateObject(state, { isAuthenticated: true, error: null });
        case actionTypes.NO_USER_EXISTS:
            return updateObject(state, { isAuthenticated: false, error: null });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, {
                isAuthenticated: false,
                error: action.error,
                isLoading: false
            });
        case actionTypes.FIRST_NAME_ENTERED:
            return updateObject(state, { firstName: action.firstName });
        case actionTypes.END_WELCOME_PAGE:
            return updateObject(state, { showWelcomePage: false });
        case actionTypes.START_SIGN_IN:
            return updateObject(state, { authFlow: authFlows.SIGN_IN });
        case actionTypes.START_SIGN_UP:
            return updateObject(state, { authFlow: authFlows.SIGN_UP });
        case actionTypes.END_SIGN_IN:
            return updateObject(state, { authFlow: null });
        case actionTypes.END_SIGN_UP:
            return updateObject(state, { authFlow: null, showWelcomePage: true });
        default:
            return state;
    }
};

export default authReducer;
