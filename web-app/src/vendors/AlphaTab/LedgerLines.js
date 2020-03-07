// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/LedgerLines.js
// Description: Utility for getting the octave of a note and counting how many ledger lines are needed
// Author: Daniel Griessler
// Email: dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// Cycle always goes C C# D D# E F F# G G# A A# B repeated twice, once for when C is on line first and once when C on space first
// Starting at C on line, walk up by half steps and this is how many ledger lines are needed
const HALF_STEP_CYCLE_UP_START_C = [
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    5,
    6,
    6,
    6,
    6,
    7,
    7,
    7
];
// Starting at A on line, walk up by half steps and this is how many ledger lines are needed
const HALF_STEP_CYCLE_UP_START_A = [
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    5,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    1,
    1,
    1
];
// Starting at C on line, walk down by half steps and this is how many ledger lines are needed
const HALF_STEP_CYCLE_DOWN_START_C = [
    1,
    1,
    7,
    7,
    7,
    6,
    6,
    6,
    6,
    5,
    5,
    5,
    4,
    4,
    4,
    4,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    1
];
// Starting at E on line, walk down by half steps and this is how many ledger lines are needed
const HALF_STEP_CYCLE_DOWN_START_E = [
    2,
    2,
    1,
    1,
    1,
    7,
    7,
    7,
    7,
    6,
    6,
    6,
    5,
    5,
    5,
    5,
    4,
    4,
    4,
    3,
    3,
    3,
    3,
    2
];

/**
 * Calculates the number of ledger lines at the provided midi
 * Assumes that you are asking when you need at least 1
 * @param {number} midi - Midi value of current note
 * @param {String} direction - Expected to either be "up" or "down" case insensitive
 * @param {String} start - Expected to be either "c" for the bass clef or "a" for the treble clef case insensitive
 * @returns The number of ledger lines or 0 if the direction/start combination is not recognized
 */
export const getNumberOfLedgerLines = (midi, direction, start) => {
    // given the octave, figure out where to start in the list
    let index = this.getOctave(midi) % 2 === 0 ? 0 : 12;
    // add to starting index the number of half steps up from C
    index += midi % 12;
    let realDirection = direction.toLowerCase();
    let realStart = start.toLowerCase();
    // if looking for ledger lines going up
    if (realDirection === "up") {
        // and in the bass clef
        if (realStart === "c") {
            // index starting at C on line going up
            return HALF_STEP_CYCLE_UP_START_C[index];
        } else if (realStart === "a") {
            // otherwise, if in the treble clef index starting at A on line going up
            return HALF_STEP_CYCLE_UP_START_A[index];
        }
        // otherwise if looking for ledger lines going down
    } else if (realDirection === "down") {
        // and in the treble clef
        if (realStart === "c") {
            // index starting at C on line going down
            return HALF_STEP_CYCLE_DOWN_START_C[index];
        } else if (realStart === "e") {
            // otherwise, if in the bass clef index starting at E on line going down
            return HALF_STEP_CYCLE_DOWN_START_E[index];
        }
    }

    // if direction and start not recognized, return 0
    return 0;
};

/**
 * Gets the octave of the current note
 * @returns The octave of the current note
 */
export const getOctave = midi => {
    return Math.floor(midi / 12) - 1;
};
