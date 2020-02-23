/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/startup.js
// Description: Redux startup reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/23/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

// Initial Redux auth state
const initialState = {
    isDone: false
};

/**
 * Updates Redux startup state based on an action type and a payload
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 */
const startupReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STARTUP_DONE:
            return updateObject(state, { isDone: true });
        default:
            return state;
    }
};

export default startupReducer;
