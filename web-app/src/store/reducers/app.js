// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

/**
 * Redux app reducer
 * @module reduxAppReducer
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Initial app state
 * @property {boolean} isMobileBrowser - Indicates if the user's brower is a mobile browser
 */
const initialState = {
    isMobileBrowser: null,
};

/**
 * Updates Redux app state based on an action type and a payload
 * @function
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 * @returns {object} The new state
 */
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.IS_MOBILE_BROWSER:
            return updateObject(state, {
                isMobileBrowser: action.isMobileBrowser,
            });
        default:
            return state;
    }
};

export default appReducer;
