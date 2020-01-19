/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/auth.js
// Description: Startup Redux reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/18/2020
---------------------------------------------------------------------------- */

import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    isStartingUp: true
};

const startupReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STARTUP_AUTH_DONE:
            return updateObject(state, { isStartingUp: false });
        default:
            return state;
    }
};

export default startupReducer;
