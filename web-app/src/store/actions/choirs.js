// File imports
import * as actionTypes from "./actionTypes";

/**
 * Redux choirs tab actions
 * @module reduxChoirsTabActions
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Return object for the choirSelectedForChoirs function
 * @typedef ChoirSelectedForChoirsReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {string} id - The choir id
 * @property {string} name - The choir name
 */

/**
 * Sets the selected choir for the choirs tab
 * @function
 * @param {string} id - The choir id
 * @param {string} name - The choir name
 * @returns {module:reduxChoirsActions~ChoirSelectedForChoirsReturnObject}
 */
export const choirSelectedForChoirs = (id, name) => {
    return {
        type: actionTypes.CHOIRS_CHOIR_SELECTED,
        id,
        name,
    };
};
