// File imports
import PerformanceData from "./PerformanceData";

/**
 * @class
 * @classdesc Keeps a list of midi values to serve as a sample of the MAX_SIZE last midi values heard
 * @category AlphaTab
 * @author Daniel Griessler <dgriessler20@gmail.com>
 */
class NoteList {
    /**
     * TODO: Description
     * @type {number}
     */
    MAX_SIZE = 5;

    /**
     * Creates a NoteList defaulting the lower pitch bound to 21 = A0 and the upper pitch bound to 127 = G9
     * @param {Number} element Initial midi value to be stored in the list of values
     */
    constructor(element) {
        /**
         * TODO: Description
         */
        this.performanceData = new PerformanceData();

        /**
         * TODO: Description
         */
        this.elements = [element];

        /**
         * TODO: Description
         */
        this.pointer = 0;

        /**
         * TODO: Description
         */
        this.total = element;

        /**
         * TODO: Description
         */
        this.average = element;

        /**
         * TODO: Description
         */
        this.lowerPitchBound = 21;

        /**
         * TODO: Description
         */
        this.upperPitchBound = 127;
    }

    /**
     * Start new performance so clear performance data
     */
    clear() {
        this.performanceData.clear();
        this.elements = [0];
        this.pointer = 0;
        this.total = 0;
        this.average = 0;
    }

    /**
     * Adds a midi value to the list of values overwriting the oldest value if full
     * @param {Number} element Midi value to be stored in the list of values
     * @param {Number} time Time when the note was started
     */
    addNote(element, time) {
        // Adds element to the list overwriting the oldest value if full
        if (this.elements.length < this.MAX_SIZE) {
            this.elements.push(element);
        } else {
            this.total -= this.elements[this.pointer];
            this.elements[this.pointer] = element;
            this.pointer = (this.pointer + 1) % this.MAX_SIZE;
        }
        this.total += element;
        this.average = Math.round(this.total / this.elements.length);

        // if the provided midi value is 0, this is the special value for silence
        // Also display silence if the average is out of bounds
        if (
            element === 0 ||
            this.average < this.lowerPitchBound ||
            this.average > this.upperPitchBound
        ) {
            // -1 is the sential value for silence to be diplayed
            this.average = -1;
        }

        this.performanceData.addPitch(this.average, time);
    }

    /**
     * Updates the lower and upper bounds on the average in terms of midi values
     * @param {Number} lowerBound Averages less than this midi value will be ignored
     * @param {Number} upperBound Averages greater than this midi value will be ignored
     */
    updateBounds(lowerBound, upperBound) {
        this.lowerPitchBound = lowerBound;
        this.upperPitchBound = upperBound;
    }
}

export default NoteList;
