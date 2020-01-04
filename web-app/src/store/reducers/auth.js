/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/auth.js
// Description:
    * Authentication Redux reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    authenticated: false,
    error: null,
    loading: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_LOADING:
            return updateObject(state, { authenticated: false, error: null, loading: true });
        case actionTypes.AUTH_SUCCESS:
            return updateObject(state, { authenticated: true, error: null, loading: false });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, {
                authenticated: false,
                error: action.error.message,
                loading: false
            });
        case actionTypes.SIGN_OUT_SUCCESS:
        case actionTypes.PASSWORD_RESET_SENT:
            return updateObject(state, { authenticated: false, error: null, loading: false });
        default:
            return state;
    }
};

export default authReducer;
