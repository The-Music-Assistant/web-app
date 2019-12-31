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

const initialState = {};

const authSuccess = (state, action) => {
    return updateObject(state, {});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // case: actionTypes.
        default:
            return state;
    }
};

export default reducer;
