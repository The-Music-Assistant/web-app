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
        /*
        try {
            if (this.pitches[this.pitches.length - 1].midival !== note) {
                this.pitches.push(new Pitch(note, time));
            }
        } catch(e) {
            this.pitches.push(new Pitch(note, time));
        }
        */
       this.pitches.push(new Pitch(note, time));
    }
}

export default PerformanceData;