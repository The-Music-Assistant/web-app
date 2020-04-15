// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

/**
 * Redux startup reducer
 * @module reduxStartupReducer
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Initial startup state
 * @property {boolean} isDone - Indicates if the app startup is done
 */
const initialState = {
    isDone: false,
};

/**
 * Updates Redux startup state based on an action type and a payload
 * @function
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 * @returns {object} The new state
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
