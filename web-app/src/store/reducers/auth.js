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
    error: null,
    firstName: null,
    showWelcomePage: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_AUTHENTICATED:
            return updateObject(state, { isAuthenticated: true, error: null });
        case actionTypes.USER_NOT_AUTHENTICATED:
            return updateObject(state, { isAuthenticated: false, error: null });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, {
                isAuthenticated: false,
                error: action.error,
                isLoading: false
            });
        case actionTypes.SIGN_OUT:
            return updateObject(state, { isAuthenticated: false });
        default:
            return state;
    }
};

export default authReducer;
