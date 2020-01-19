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
    isAuthenticated: false,
    error: null,
    isLoading: true,
    isSigningUp: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_LOADING:
            return updateObject(state, { isLoading: true });
        case actionTypes.USER_EXISTS:
            return updateObject(state, { isAuthenticated: true, error: null, isLoading: false });
        case actionTypes.NO_USER_EXISTS:
            return updateObject(state, { isAuthenticated: false, error: null, isLoading: false });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, {
                isAuthenticated: false,
                error: action.error,
                isLoading: false
            });
        case actionTypes.BEGIN_SIGN_UP:
            return updateObject(state, { isSigningUp: true });
        case actionTypes.END_SIGN_UP:
            return updateObject(state, { isSigningUp: false });
        default:
            return state;
    }
};

export default authReducer;
