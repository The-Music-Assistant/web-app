/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/practice.js
// Description: Redux practice reducer
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/26/2020
---------------------------------------------------------------------------- */

// File imports
import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

// Initial Redux practice state
const initialState = {
    selectedChoirId: null,
    selectedChoirName: null,
    selectedSheetMusicId: null,
    exercise: null,
    doesUserGetFeedback: null,
};

/**
 * Updates Redux auth state based on an action type and a payload
 * @param {object} state - The current state
 * @param {object} action - Any needed data (including the action type)
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
