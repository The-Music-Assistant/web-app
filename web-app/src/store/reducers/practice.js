// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

/**
 * Redux practice tab reducer
 * @module reduxPracticeTabReducer
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Initial practice tab state
 * @property {string} selectedChoirId - The selected choir id
 * @property {string} selectedChoirName - The selected choir name
 * @property {string} selectedSheetMusicId -
 * @property {object} exercise - The requested exercise (if one exists)
 * @property {string} exercise.startMeasure - The start measure
 * @property {string} exercise.endMeasure - The end measure
 * @property {string} doesUserGetFeedback - Indicates if the user gets feedback
 */
const initialState = {
    selectedChoirId: null,
    selectedChoirName: null,
    selectedSheetMusicId: null,
    exercise: null,
    doesUserGetFeedback: null,
};

/**
 * Updates Redux auth state based on an action type and a payload
 * @function
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
 * @returns {object} The new state
 */
const practiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PRACTICE_CHOIR_SELECTED:
            return updateObject(state, {
                selectedChoirId: action.id,
                selectedChoirName: action.name,
            });
        case actionTypes.PRACTICE_SONG_SELECTED:
            return updateObject(state, { selectedSheetMusicId: action.id });
        case actionTypes.EXERCISE_REQUESTED:
            return updateObject(state, {
                exercise: {
                    startMeasure: action.startMeasure,
                    endMeasure: action.endMeasure,
                },
            });
        case actionTypes.EXERCISE_GENERATED:
            return state;
        case actionTypes.USER_GETS_FEEDBACK:
            return updateObject(state, { doesUserGetFeedback: true });
        case actionTypes.USER_DOES_NOT_GET_FEEDBACK:
            return updateObject(state, { doesUserGetFeedback: false });
        default:
            return state;
    }
};

export default practiceReducer;
