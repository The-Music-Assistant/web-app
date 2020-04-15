// File imports
import * as actionTypes from "./actionTypes";

/**
 * Redux startup actions
 * @module reduxStartupActions
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Return object for the startupDone function
 * @typedef StartupDoneReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the app startup is done
 * @function
 * @returns {module:reduxStartupActions~StartupDoneReturnObject}
 */
export const startupDone = () => {
    return {
        type: actionTypes.STARTUP_DONE,
    };
};
