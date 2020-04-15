/**
 * Destroys the AlphaTab api.
 * Ends pitch detection.
 * Removes the P5 drawing object.
 * @module alphaTabDestruction
 * @author Daniel Griessler <dgriessler20@gmail.com>
 * @author Dan Levy <danlevy124@gmail.com>
 */

// File imports
import atVars from "./variables";
import * as playerStates from "./playerStates";
import destroyPitchDetection from "../ML5/PitchDetection/destruction";

/**
 * Destroys the api if initialized.
 * Destroys the p5Obj if initialized.
 * Stops the microphone input it is being used.
 * @function
 * @returns {Promise} Promise that resolves after api is destroyed and cleared
 */
const destroy = () => {
    if (atVars.playerState === playerStates.PLAYING) {
        // Stops the player
        atVars.playerState = playerStates.PENDING_STOP;
        atVars.api.stop();
    }

    // Ends pitch detection
    destroyPitchDetection();

    if (atVars.p5Obj !== null) {
        // Removes the p5 canvas
        atVars.p5Obj.remove();
    }

    // Returns a promise that waits for AlphaTab to stop playing
    return new Promise((resolve) => {
        // Waits for the player state to change to 0 (stopped) before destroying the api
        atVars.api.addPlayerStateChanged(() => {
            // Destroys the AlphaTab api
            atVars.api.destroy();

            // Reinitializes AlphaTab variables
            atVars.initialize();

            resolve();
        });
    });
};

export default destroy;
