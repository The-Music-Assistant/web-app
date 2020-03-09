// ----------------------------------------------------------------------------
// File Path: src/reducers/choirs.js
// Description: Redux choirs reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/9/2020
// ----------------------------------------------------------------------------

// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

// Initial Redux choirs state
const initialState = {
    selectedChoirId: null,
    selectedChoirName: null
};

/**
 * Updates Redux choirs state based on an action type and a payload
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 */
const choirsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHOIRS_CHOIR_SELECTED:
            return updateObject(state, {
                selectedChoirId: action.id,
                selectedChoirName: action.name
            });
        default:
            return state;
    }
};

export default choirsReducer;
