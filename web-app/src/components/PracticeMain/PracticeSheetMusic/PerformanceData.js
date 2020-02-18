import Pitch from "./Pitch.js";
/**
 * Encapsulates performance data
 */
class PerformanceData {
    /**
    * Creates a PerformanceData
    */
    constructor() {
        this.pitches = [];
    }

    /**
     * Clear the pitches from storage
     */
    clear() {
        this.pitches.length = 0;
    }

    /**
     * Creates a new pitch and stores it in the list of pitches
     * @param {Number} note Midi value to be stored in the list of values
     * @param {Number} time Time when the note was started
     */
    addPitch(note, time) {
        // TODO: Check to see if this is giving accurate enough data of performance. This if statement was added because we were getting a performance where the time from the first to the second note was exactly the same
        const EPSILON = 0.00001;
        try {
            if (this.pitches[this.pitches.length - 1].midival !== note) {
                if (Math.abs(this.pitches[this.pitches.length - 1].time - time) < EPSILON) {
                    this.pitches[this.pitches.length - 1].midival = note;
                } else {
                    this.pitches.push(new Pitch(note, time));
                }
            }
        } catch(e) {
            this.pitches.push(new Pitch(note, time));
        }
    }
}

export default PerformanceData;