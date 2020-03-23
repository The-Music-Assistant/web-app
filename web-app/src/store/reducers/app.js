/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/app.js
// Description: Redux app reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/23/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

// Initial Redux app state
const initialState = {
    isMobileBrowser: null
};

/**
 * Updates Redux app state based on an action type and a payload
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 */
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.IS_MOBILE_BROWSER:
            return updateObject(state, { isMobileBrowser: action.isMobileBrowser });
        default:
            return state;
    }
};

export default appReducer;
