// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/variables.js
// Description: Pitch Detection variables
// Author: Daniel Griessler & Dan Levy
// Email: dgriessler20@gmail.com & danlevy124@gmail.com
// Created Date: 3/7/2020
// ----------------------------------------------------------------------------

// NPM module imports
import ml5 from "ml5";

/**
 * @class
 * @classdesc Pitch Detection variables
 */
class PitchDetectionVariables {
    audioContext;
    micStream;
    pitchDetectionModel;

    /**
     * Sets up ML5 pitch detection
     */
    initialize = () => {
        // Creates pitch detection model
        return ml5.pitchDetection(
            "/Pitch-Detection-Model/",
            this.audioContext,
            this.micStream
        ).ready;
    };
}

// Exports a singleton of this class
export default new PitchDetectionVariables();
