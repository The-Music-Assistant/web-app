/* ----------------------------------------------------------------------------
// File Path: src/store/actions/practice.js
// Description: Practice tab Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/26/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "./actionTypes";

/**
 * Returns the PRACTICE_CHOIR_SELECTED action type, choir id, and choir name
 * @param {string} id - The choir id
 * @param {string} name - The choir name
 */
export const choirSelectedForPractice = (id, name) => {
    return {
        type: actionTypes.PRACTICE_CHOIR_SELECTED,
        id,
        name
    };
};
