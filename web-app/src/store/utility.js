/**
 * Redux utility functions
 * @module reduxUtilities
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Returns an updated object (deep copy).
 * NOTE: The deep copy is only one level deep.
 * @function
 * @param {object} oldObject - The old object
 * @param {object} updatedProperties - Updated object properties
 * @returns {object} The new object
 */
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};
