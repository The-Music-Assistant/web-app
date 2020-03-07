// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/destruction.js
// Description:
//      * Destroys the AlphaTab api
//      * Ends pitch detection
//      * Removes the P5 drawing object
// Author: Daniel Griessler & Dan Levy
// Email: dgriessler20@gmail.com & danlevy124@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// File imports
import { api, playerState, p5Obj } from "./initialization";
import * as playerStates from "./playerStates";
import destroyPitchDetection from "../ML5/PitchDetection/destruction";

/**
 * Destroys the api if initialized
 * Destroys the p5Obj if initialized
 * Stops the microphone input it is being used
 */
const destroy = () => {
    if (playerState === playerStates.PLAYING) {
        // Stops the player
        playerState = playerStates.PAGE_CHANGED;
        api.stop();
    }

    // Returns a promise that waits for AlphaTab to stop playing
    return new Promise(resolve => {
        // Waits for the player state to change to 0 (stopped) before destroying the api
        const intervalId = setInterval(() => {
            if (playerState === 0) {
                // Stops the interval
                clearInterval(intervalId);

                // Ends pitch detection
                destroyPitchDetection();

                if (api !== null) {
                    // Destroys the AlphaTab api
                    api.destroy();
                }
                if (p5Obj !== null) {
                    // Removes the p5 canvas
                    p5Obj.remove();
                }

                // Resolves the promise
                resolve();
            }
        }, 500);
    });
};

export default destroy;
