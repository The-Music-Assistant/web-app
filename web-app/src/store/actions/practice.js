// File imports
import * as actionTypes from "./actionTypes";

/**
 * Redux practice tab actions
 * @module reduxPracticeTabActions
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Return object for the choirSelectedForPractice function
 * @typedef ChoirSelectedForPracticeReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {string} id - The choir id
 * @property {string} name - The choir name
 */

/**
 * Sets the selected choir for the practice tab
 * @function
 * @param {string} id - The choir id
 * @param {string} name - The choir name
 * @returns {module:reduxPracticeTabActions~ChoirSelectedForPracticeReturnObject}
 */
export const choirSelectedForPractice = (id, name) => {
    return {
        type: actionTypes.PRACTICE_CHOIR_SELECTED,
        id,
        name,
    };
};

/**
 * Return object for the musicSelectedForPractice function
 * @typedef MusicSelectedForPracticeReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {string} id - The sheet music id
 */

/**
 * Sets the selected choir
 * @function
 * @param {string} id - The sheet music id
 * @returns {module:reduxPracticeTabActions~MusicSelectedForPracticeReturnObject}
 */
export const musicSelectedForPractice = (id) => {
    return {
        type: actionTypes.PRACTICE_SONG_SELECTED,
        id,
    };
};

/**
 * Return object for the exerciseRequested function
 * @typedef ExerciseRequestedReturnObject
 * @property {module:reduxActionTypes} type - An action type
 * @property {string} startMeasure - The start measure
 * @property {string} endMeasure - The end measure
 */

/**
 * Requests an exercise
 * @function
 * @param {string} startMeasure - The selected start measure
 * @param {string} endMeasure - The selected end measure
 * @returns {module:reduxPracticeTabActions~ExerciseRequestedReturnObject}
 */
export const exerciseRequested = (startMeasure, endMeasure) => {
    return {
        type: actionTypes.EXERCISE_REQUESTED,
        startMeasure,
        endMeasure,
    };
};

/**
 * Return object for the exerciseGenerated function
 * @typedef ExerciseGeneratedReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the exercise has been generated
 * @function
 * @returns {module:reduxPracticeTabActions~ExerciseGeneratedReturnObject}
 */
export const exerciseGenerated = () => {
    return {
        type: actionTypes.EXERCISE_GENERATED,
    };
};

/**
 * Return object for the setUserGetsFeedback function
 * @typedef SetUserGetsFeedbackReturnObject
 * @property {module:reduxActionTypes} type - An action type
 */

/**
 * Indicates that the exercise has been generated
 * @function
 * @returns {module:reduxPracticeTabActions~SetUserGetsFeedbackReturnObject}
 */
// export const setUserGetsFeedback = (doesUserGetFeedback) => {
//     return {
//         type: doesUserGetFeedback
//             ? actionTypes.USER_GETS_FEEDBACK
//             : actionTypes.USER_DOES_NOT_GET_FEEDBACK,
//     };
// };
