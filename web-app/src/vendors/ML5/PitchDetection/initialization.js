// File imports
import ptVars from "./variables";

/**
 * Pitch detection initialization
 * @module pitchDetectionInitialization
 * @author Daniel Griessler <dgriessler20@gmail.com>
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Sets up pitch detection
 * @function
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
