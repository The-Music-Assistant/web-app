/* ----------------------------------------------------------------------------
// File Path: src/store/actions/startup.js
// Description: Startup Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/23/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "./actionTypes";

/**
 * Returns STARTUP_DONE action type
 */
export const startupDone = () => {
    return {
        type: actionTypes.STARTUP_DONE
    }
}
