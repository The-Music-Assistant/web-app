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
    isAuthenticated: false,
    error: null,
    loading: true,
    pageName: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_LOADING:
            return updateObject(state, { isAuthenticated: false, error: null, loading: true });
        case actionTypes.AUTH_SUCCESS:
            return updateObject(state, { isAuthenticated: true, error: null, loading: false });
        case actionTypes.AUTH_ERROR:
            return updateObject(state, {
                isAuthenticated: false,
                error: action.error,
                loading: false
            });
        case actionTypes.SIGN_OUT_SUCCESS:
        case actionTypes.PASSWORD_RESET_SENT:
            return updateObject(state, { isAuthenticated: false, error: null, loading: false });
        case actionTypes.AUTH_FLOW_PAGE_CHANGED:
            return updateObject(state, { pageName: action.pageName });
        default:
            return state;
    }
};

export default authReducer;
