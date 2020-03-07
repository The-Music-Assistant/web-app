// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/initialization.js
// Description: Pitch detection initialization
// Author: Dan Levy & Daniel Griessler
// Email: danlevy124@gmail.com & dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// NPM module imports
import ml5 from "ml5";

export let audioContext;
export let micStream;
export let pitchDetectionModel;
// let noteList;            // TODO: Is this needed?

/**
 * Sets up pitch detection
 */
const setupPitchDetection = () => {
    return new Promise((resolve, reject) => {
        // Creates an AudioContext instance
        audioContext = new AudioContext();

        // Starts microphone stream if available
        if (navigator.mediaDevices) {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(stream => {
                    micStream = stream;

                    // Sets up ML5 pitch detection
                    initialize()
                        .then(model => {
                            pitchDetectionModel = model;
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            reject("Cannot access the microphone.");
        }
    });
};

/**
 * Sets up ML5 pitch detection
 */
const initialize = () => {
    // Creates pitch detection model
    return ml5.pitchDetection("/Pitch-Detection-Model/", audioContext, micStream).ready;
};

export default setupPitchDetection;
