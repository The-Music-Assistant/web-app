/* ----------------------------------------------------------------------------
// File Path: src/store/actions/app.js
// Description: App Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/23/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "./actionTypes";

export const setBrowserType = isMobileBrowser => {
    return {
        type: actionTypes.IS_MOBILE_BROWSER,
        isMobileBrowser
    };
};
