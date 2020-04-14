// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/Pitch.js
// Description: Encapsulates a recorded pitch
// Author: Daniel Griessler
// Email: dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

/**
 * @class
 * @classdesc Encapsulates a recorded pitch
 */
class Pitch {
    /**
     * Creates a Pitch
     * @param {Number} note Percieved pitch
     * @param {Number} time Time when the note was started
     */
    constructor(note, time) {
        this.midival = note;
        this.timepos = time;
    }
}

export default Pitch;
