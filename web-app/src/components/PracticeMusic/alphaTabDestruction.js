import * as atVars from "./alphaTabInitialization";
import * as musicPlayerStates from "./musicPlayerStates";
import PitchDetection from "./PitchDetection";

/**
 * Destroys the api if initialized
 * Destroys the p5Obj if initialized
 * Stops the microphone input it is being used
 */
export const destroy = () => {
    if (atVars.playerState === musicPlayerStates.PLAYING) {
        // Stops the player
        atVars.playerState = musicPlayerStates.PAGE_CHANGED;
        atVars.api.stop();
    }

    // Returns a promise that waits for AlphaTab to stop playing
    return new Promise(resolve => {
        // Waits for the player state to change before destroying the api
        const intervalId = setInterval(() => {
            if (atVars.playerState === 0) {
                // Stops the interval
                clearInterval(intervalId);

                if (PitchDetection.micStream && PitchDetection.micStream !== null) {
                    // Ends pitch detection
                    PitchDetection.endPitchDetection();
                }
                if (atVars.api !== null) {
                    // Destroys the AlphaTab api
                    atVars.api.destroy();
                }
                if (atVars.p5Obj !== null) {
                    // Removes the p5 canvas
                    atVars.p5Obj.remove();
                }

                // Resolves the promise
                resolve();
            }
        }, 500);
    });
};
