// NPM module imports
import ml5 from "ml5";

/**
 * @class
 * @classdesc Pitch Detection variables
 * @category PitchDetection
 * @author Dan Levy <danlevy124@gmail.com>
 */
class PitchDetectionVariables {
    /**
     * The audio context.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.
     */
    audioContext;

    /**
     * The microphone stream
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia.
     */
    micStream;

    /**
     * The pitch detection model.
     * This is the ML model provided by ML5.
     */
    pitchDetectionModel;

    /**
     * Sets up ML5 pitch detection
     * @returns {Promise} A promise with the pitch detection model
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
