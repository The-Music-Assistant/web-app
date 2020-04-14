// File imports
import * as actionTypes from "./actionTypes";

/**
 * Redux app actions
 * @module reduxAppActions
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Sets the browser type
 * @function
 * @param {boolean} isMobileBrowser - Indicates if the browser is a mobile browser
 * @returns {SetBrowserTypeReturnObject}
 */
export const setBrowserType = (isMobileBrowser) => {
    /**
     * Return object for the setBrowserType function
     * @typedef {object} SetBrowserTypeReturnObject
     * @property {module:reduxActionTypes} type - An action type
     * @property {boolean} isMobileBrowser - Indicates if the browser is a mobile browser
     */
    return {
        type: actionTypes.IS_MOBILE_BROWSER,
        isMobileBrowser,
    };
};
