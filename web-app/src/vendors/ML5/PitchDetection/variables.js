// NPM module imports
import ml5 from "ml5";

/**
 * @class
 * @classdesc Pitch Detection variables
 * @author Daniel Griessler <dgriessler20@gmail.com>
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
