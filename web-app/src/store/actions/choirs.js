/* ----------------------------------------------------------------------------
// File Path: src/store/actions/choirs.js
// Description: Choirs tab Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/9/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "./actionTypes";

/**
 * Returns the CHOIRS_CHOIR_SELECTED action type, choir id, and choir name
 * @param {string} id - The choir id
 * @param {string} name - The choir name
 */
export const choirSelectedForChoirs = (id, name) => {
    return {
        type: actionTypes.CHOIRS_CHOIR_SELECTED,
        id,
        name
    };
};
