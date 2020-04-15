// File imports
import { getNumberOfLedgerLines, getOctave } from "../AlphaTab/ledgerLines";

/**
 * @class
 * @classdesc Keeps track of current note and where to draw it on the screen along with special information such as number of extra ledger lines
 * @category P5
 * @author Daniel Griessler <dgriessler20@gmail.com>
 */
class Drawer {
    /**
     * Creates a new Drawer setting up storage of the most recent midi note and information about how to draw it on the screen
     * @param {Number} topLine Height of the top line of the selected part to sing
     * @param {Number} distanceBetweenLines Distance between lines in the staff
     */
    constructor(topLine, distanceBetweenLines, baseOctave) {
        this.topLine = topLine;
        this.distanceBetweenLines = distanceBetweenLines;
        // stores the height of the lowest line of the staff being sung
        this.firstLine = this.topLine + this.distanceBetweenLines * 5;
        // Values >= selected lower limit and <= selected upper limit don't need extra ledger lines
        this.lowerLimit = 61; // 61 = C4#
        this.upperLimit = 81; // 81 = A5
        this.lowerLimit2 = 40; // 40 = E2
        this.upperLimit2 = 60; // 60 = C4
        this.note = new Note(60);
        this.belowOrAbove = 0;
        this.noteHeight = 0;
        this.baseOctave = baseOctave;
        this.updateNote(this.note.midiVal);
    }

    /**
     * Sets the stored height of the top line, the distance between ledger lines, and the base octave
     * @param {number} topLine The height of the top ledger line
     * @param {number} distanceBetweenLines The y distance between ledger lines
     * @param {number} baseOctave The base octave of the current clef
     */
    setTopLineAndDistanceBetween(topLine, distanceBetweenLines, baseOctave) {
        this.topLine = topLine + 1;
        this.distanceBetweenLines = distanceBetweenLines;
        // stores the height of the lowest line of the staff being sung
        this.firstLine =
            this.topLine +
            this.distanceBetweenLines * (baseOctave === 4 ? 5 : 6);
        this.baseOctave = baseOctave;
    }

    /**
     * Sets the base octave
     * @param {number} baseOctave The base octave of the current clef
     */
    setBaseOctave(baseOctave) {
        this.baseOctave = baseOctave;
    }

    /**
     * Updates the Drawer to the new provided note
     * @param {Number} note New midi value to store. Provide a -1 as a sentinel value for silence
     */
    updateNote(note) {
        this.note.updateNote(note);
        this.getHeightOfNote();
        this.getExtraFeatures();
    }

    /**
     * Updates the height of the note based on its midi value
     */
    getHeightOfNote() {
        // -1 is a sentinel value for silence which is assigned a default height
        if (this.note.midiVal === -1) {
            this.noteHeight = this.firstLine;
            return;
        }
        // Calculating the height of a note relies on the cycle in musical notes that occurs between octaves
        // This calculates what the height of the note should be based on the first line
        const heightMod = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

        // based on the starting note subtract the base octave since the start note is in that given octave
        let octaveMod = this.note.octave - this.baseOctave;
        let value = heightMod[this.note.midiVal % heightMod.length];

        // Includes bump to jump between octaves
        let totalMod = value + octaveMod * 7;

        // final height includes division by 2 because each value in the totalMod is distanceBetweenLines/2
        this.noteHeight =
            this.firstLine - (totalMod * this.distanceBetweenLines) / 2;
    }

    /**
     * Gets the extra features of a note including how many ledger lines to add
     */
    getExtraFeatures() {
        // -1 is a sentinel value for silence which has no ledger lines
        if (this.note.midiVal === -1) {
            this.belowOrAbove = 0;
            return;
        }

        // // similar to note height, there's a cycle between octaves for ledger lines
        // const aboveBelowMod = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4];

        // sets up base if ledger lines are even needed. base == 0 means no ledger lines
        // base < 0 means they go below the staff, base > 0 means they go above the staff
        let base = 0;
        let actualUpperLimit;
        let actualLowerLimit;
        if (this.baseOctave === 4) {
            actualUpperLimit = this.upperLimit;
            actualLowerLimit = this.lowerLimit;
        } else {
            actualUpperLimit = this.upperLimit2;
            actualLowerLimit = this.lowerLimit2;
        }
        if (this.note.midiVal >= actualUpperLimit) {
            base = actualUpperLimit;
        } else if (this.note.midiVal <= actualLowerLimit) {
            base = -1 * actualLowerLimit;
        }

        // If need ledger lines, then calculate how many are required
        if (base !== 0) {
            let direction;
            let start;
            if (base > 0) {
                direction = "up";
                start = this.baseOctave === 4 ? "a" : "c";
            } else {
                direction = "down";
                start = this.baseOctave === 4 ? "c" : "e";
            }

            // LedgerLines loop every 24 notes so if more than 24 then add 7 octaves
            let difference = Math.abs(Math.abs(base) - this.note.midiVal);
            let loopAdd = 7 * Math.floor(difference / 24);
            this.belowOrAbove =
                getNumberOfLedgerLines(this.note.midiVal, direction, start) +
                loopAdd;

            // Signals to draw ledger lines below staff
            if (base < 0) {
                this.belowOrAbove *= -1;
            }
        } else {
            this.belowOrAbove = 0;
        }
    }
}

/**
 * @class
 * @category P5
 * @classdesc Stores midi value as its character representation including its octave and if it is sharp
 */
class Note {
    /**
     * Constructs a Note from a provided a given midiVal and converts it to a string which can be accessed
     * @param {Number} midiVal Midi value of note to store
     */
    constructor(midiVal) {
        this.updateNote(midiVal);
    }

    /**
     * Updates the note stored to the new note
     * @param {Number} note New midi value to store
     */
    updateNote(note) {
        // No point in updating if the midi value matches the current one
        if (this.midiVal && note === this.midiVal) {
            return;
        }

        this.midiVal = note;
        const noteText = this.numToNote();
        this.charPart = noteText.charPart;
        this.octave = noteText.octave;

        // relies on the char part with being a single letter like G or two letters which is the note and # for sharp
        this.isSharp = this.charPart.length === 2;
    }

    /**
     * @typedef {object} NotePackage
     * @memberof Drawer
     * @property {string} charPart The character part of the note
     * @property {number} octave The octave of the note
     */

    /**
     * Converts the stored midi value to its character representation
     * @returns {NotePackage} A tuple with the character part and the octave
     */
    numToNote() {
        let charPart;
        let octave;

        // -1 is a sentinel value for silence which has no char part or octave
        if (this.midiVal === -1) {
            charPart = "-";
            octave = "";
        } else {
            const letters = [
                "C",
                "C#",
                "D",
                "D#",
                "E",
                "F",
                "F#",
                "G",
                "G#",
                "A",
                "A#",
                "B",
            ];
            charPart = letters[this.midiVal % letters.length];
            octave = getOctave(this.midiVal);
        }
        return { charPart, octave };
    }
}

export default Drawer;
