// File imports
import ptVars from "./variables";

/**
 * Pitch detection initialization
 * @module pitchDetectionDestruction
 * @category PitchDetection
 * @author Daniel Griessler <dgriessler20@gmail.com>
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Ends pitch detection.
 * Turns off the microphone.
 * @function
 */
const destroy = () => {
    if (ptVars.micStream && ptVars.micStream.getTracks()[0]) {
        // Stops the mic stream
        ptVars.micStream.getTracks()[0].stop();
    }

    // Sets the micStream to null in ptVars
    ptVars.micStream = null;
};

export default destroy;
