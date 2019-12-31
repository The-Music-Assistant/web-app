/* ----------------------------------------------------------------------------
// File Path: src/index.js
// Description:
    * Redux utilities
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

/**
 * Returns an updated store object (deep copy)
 * @param {Object} oldObject - The old store object
 * @param {Object} updatedProperties - Updated store properties
 * @returns {Object}
 */
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}