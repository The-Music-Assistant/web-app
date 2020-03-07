// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/initialization.js
// Description: Pitch detection initialization
// Author: Dan Levy & Daniel Griessler
// Email: danlevy124@gmail.com & dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

import * as ptVars from "./initialization";

/**
 * Ends pitch detection
 * Turns off the microphone
 */
const destroy = () => {
    if (ptVars.micStream && ptVars.micStream.getTracks()[0]) {
        ptVars.micStream.getTracks()[0].stop();
    }
    ptVars.micStream = null;
};

export default destroy;
