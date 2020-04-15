// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

/**
 * Redux choirs tab reducer
 * @module reduxChoirsTabReducer
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Initial choirs tab state
 * @property {string} selectedChoirId - The selected choir id
 * @property {string} selectedChoirName - The selected choir name
 */
const initialState = {
    selectedChoirId: null,
    selectedChoirName: null,
};

/**
 * Updates Redux choirs state based on an action type and a payload
 * @function
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 * @returns {object} The new state
 */
const choirsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHOIRS_CHOIR_SELECTED:
            return updateObject(state, {
                selectedChoirId: action.id,
                selectedChoirName: action.name,
            });
        default:
            return state;
    }
};

export default choirsReducer;
