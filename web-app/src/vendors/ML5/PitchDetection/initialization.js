// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/initialization.js
// Description: Pitch detection initialization
// Author: Dan Levy & Daniel Griessler
// Email: danlevy124@gmail.com & dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

/**
 * Pitch detection initialization
 * @module initialization
 * @author Daniel Griessler <dgriessler20@gmail.com> & Dan Levy <danlevy124@gmail.com>
 */

// File imports
import ptVars from "./variables";

/**
 * Sets up pitch detection
 */
const setupPitchDetection = () => {
    return new Promise((resolve, reject) => {
        // Creates an AudioContext instance
        ptVars.audioContext = new AudioContext();

        // Starts microphone stream if available
        if (navigator.mediaDevices) {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    ptVars.micStream = stream;

                    // Sets up ML5 pitch detection
                    ptVars
                        .initialize()
                        .then((model) => {
                            ptVars.pitchDetectionModel = model;
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        } else {
            reject("Cannot access the microphone.");
        }
    });
};

export default setupPitchDetection;
