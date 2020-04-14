// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/TexLoaded.js
// Description: Encapsulates information about the currently loaded AlphaTex
// Author: Daniel Griessler
// Email: dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

/**
 * @class
 * @classdesc Encapsulates information about the currently loaded AlphaTex
 */
class TexLoaded {
    /**
     * Creates a new TexLoaded
     * @param {string} typeOfTex The type of AlphaTex that is loaded. TODO: Should probably be replaced by an enum
     * @param {string[]} partNames The parts that can be selected from the sheet music
     * @param {string[]} clefs Clefs per staff for the sheet music
     * @param {string} myPart The name of the user's part
     * @param {string} id Can be null, if not null then the ID of the Exercise that is loaded TODO: Rename property to more useful name
     * @param {number} measureStart The start measure number of the loaded AlphaTex
     * @param {number} measureEnd The end measure number of the loaded AlphaTex
     * @param {string} sheetMusicId The ID of the sheet music that the AlphaTex is tied to. TODO: Get this from state if possible and remove property
     */
    constructor(
        typeOfTex,
        partNames,
        clefs,
        myPart,
        id,
        measureStart,
        measureEnd,
        sheetMusicId
    ) {
        this.typeOfTex = typeOfTex;
        this.partNames = partNames;
        this.myPart = myPart;
        this.mutedTracks = [];
        this.clefs = clefs;
        if (this.clefs) {
            this.clefs.forEach((track) => {
                for (let i = 0; i < track.length; i++) {
                    track[i] = track[i].toLowerCase();
                }
                this.mutedTracks.push(false);
            });
        }
        this.currentTrackIndexes = [0];
        this.firstBarMeasurePosition = null;
        this.measureLengths = null;
        this.lengthsPerSection = null;
        this.id = id;
        this.measureStart = measureStart;
        this.measureEnd = measureEnd;
        this.performanceId = null;
        this.sheetMusicId = sheetMusicId;
    }

    /**
     * Sets the first measure position based on the cursor bar
     */
    setFirstMeasurePosition() {
        // Tex loaded wrapper tracks the position of the first measure which will now have moved and may have changed size
        // On a re-render, the bar cursor will go back to the beginning of the music, so use its position to update the first bar position
        let barCursor = document.querySelector(".at-cursor-bar");
        this.firstBarMeasurePosition = {
            left: parseInt(
                barCursor.style.left.substring(
                    0,
                    barCursor.style.left.length - 2
                ),
                10
            ),
            top: parseInt(
                barCursor.style.top.substring(
                    0,
                    barCursor.style.left.length - 2
                ),
                10
            ),
            width: parseInt(
                barCursor.style.width.substring(
                    0,
                    barCursor.style.left.length - 2
                ),
                10
            ),
            height: parseInt(
                barCursor.style.height.substring(
                    0,
                    barCursor.style.left.length - 2
                ),
                10
            ),
        };
    }

    /**
     * Create section lengths of the given size out of the sheet music
     * @param {number[]} measureLengths The lengths of each measure in seconds
     * @param {number} barCount The size of each section
     */
    setMeasureLengths(measureLengths, barCount) {
        this.measureLengths = measureLengths;
        this.lengthsPerSection = [];
        let count = 0;
        let total = 0;
        for (let i = this.measureStart; i <= this.measureEnd; i++) {
            let nextLength = this.measureLengths[i - this.measureStart];
            if (isNaN(nextLength)) {
                break;
            }
            total += nextLength;
            if (count === barCount - 1) {
                this.lengthsPerSection.push(total);
                total = 0;
                count = 0;
            }
        }
        if (count > 0) {
            this.lengthsPerSection.push(total);
        }
    }

    /**
     * Updates the section lengths within the provided bounds of the provided size.
     * TODO: Merge functionality with setMeasureLengths
     * @param {number} measureStart The starting measure number
     * @param {number} measureEnd The ending measure number
     * @param {number} barCount The size of each section
     */
    updateLengthsPerSection(measureStart, measureEnd, barCount) {
        this.measureStart = measureStart;
        this.measureEnd = measureEnd;
        this.lengthsPerSection = [];
        let count = 0;
        let total = 0;
        for (let i = this.measureStart; i <= this.measureEnd; i++) {
            let nextLength = this.measureLengths[i - this.measureStart];
            if (isNaN(nextLength)) {
                break;
            }
            total += nextLength;
            count++;
            if (count === barCount - 1) {
                this.lengthsPerSection.push(total);
                total = 0;
                count = 0;
            }
        }
        if (count > 0) {
            this.lengthsPerSection.push(total);
        }
    }

    /**
     * Updates information about the loaded AlphaTex
     * @param {string} typeOfTex The type of AlphaTex that is loaded.
     * @param {string[]} partNames The parts that can be selected from the sheet music
     * @param {string[]} clefs Clefs per staff for the sheet music
     * @param {string} myPart The name of the user's part
     * @param {string} id Can be null, if not null then the ID of the Exercise that is loaded
     * @param {number} measureStart The start measure number of the loaded AlphaTex
     * @param {number} measureEnd The end measure number of the loaded AlphaTex
     */
    update(typeOfTex, partNames, clefs, myPart, id, measureStart, measureEnd) {
        this.typeOfTex = typeOfTex;
        this.partNames = partNames;
        this.clefs = clefs;
        if (this.clefs) {
            this.clefs.forEach((track) => {
                for (let i = 0; i < track.length; i++) {
                    track[i] = track[i].toLowerCase();
                }
                this.mutedTracks.push(false);
            });
        }
        this.myPart = myPart;
        this.currentTrackIndexes = [0];
        this.firstBarMeasurePosition = null;
        this.measureLengths = null;
        this.lengthsPerSection = null;
        this.id = id;
        this.measureStart = measureStart;
        this.measureEnd = measureEnd;
    }

    /**
     * Get the start octave of the loaded part
     * @returns {number} The start octave of the loaded part
     */
    getStartOctave() {
        const TREBLE_START = 4;
        const BASS_START = 2;
        let trackIndex = this.currentTrackIndexes[0];
        if (
            trackIndex > this.clefs.length ||
            this.clefs[trackIndex][0] === "treble"
        ) {
            return TREBLE_START;
        } else if (
            this.clefs[trackIndex][0] === "f4" ||
            this.clefs[trackIndex][0] === "bass"
        ) {
            return BASS_START;
        } else {
            return TREBLE_START;
        }
    }

    /**
     * Update the loaded track
     * @param {number} trackIndex The new loaded track index
     */
    updateCurrentTrackIndexes(trackIndex) {
        this.currentTrackIndexes[0] = trackIndex;
    }
}

export default TexLoaded;
