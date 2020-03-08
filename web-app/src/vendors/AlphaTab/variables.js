// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/variables.js
// Description: AlphaTab variables
// Author: Daniel Griessler & Dan Levy
// Email: dgriessler20@gmail.com & danlevy124@gmail.com
// Created Date: 3/7/2020
// ----------------------------------------------------------------------------

// File imports
import * as highlightingOptions from "../P5/highlightingOptions";

class AlphaTabVariables {
    api; // AlphaTab API
    p5Obj; // Instance of p5 (drawing tool)
    noteStream; // Stream of midi/durations for the expected performance for the green/yellow/red highlighting
    noteStreamIndex; // Index into the note stream
    cumulativeTime; // Cumulative time passed in song used with the note stream array
    texLoaded; // Information about the alphaTex that is currently loaded
    isFirstRender; // Boolean to distinguish between the first render and subsequent renders
    barCount; // Number of bars to display at one time
    shouldResetDrawPositions; // Boolean signaling to p5Obj to reset its draw position
    drawer; // Instance of the p5 drawer which provides information about the last note heard for drawing
    noteList; // Instance of note list providing an average measurement of the last midi value heard
    highlightMeasures; // Enum signaling to sketch when it should highlight instead of normally draw feedback (TODO: This can be removed if we have two different p5 objects)
    playerState; // Enum holding the current state of the player to avoid confusion during re-renders
    getsFeedback; // Boolean indicating whether or not the user gets feedback
    sheetMusicLength; // Number holding the length of the current sheet music (used for re-rendering in the performance overview page vs the exercise or sheet music view)
    sketchBehavior;

    /**
     * Sets AlphaTab variables to their initial values
     */
    initialize = () => {
        this.api = null;
        this.p5Obj = null;
        this.noteStream = [-1, 0];
        this.noteStreamIndex = 0;
        this.cumulativeTime = 0;
        this.texLoaded = null;
        this.isFirstRender = true;
        this.barCount = 20;
        this.shouldResetDrawPositions = true;
        this.drawer = null;
        this.noteList = null;
        this.highlightMeasures = highlightingOptions.HIGHLIGHT_OFF;
        this.playerState = 0;
        this.getsFeedback = false;
        this.sheetMusicLength = null;
    };
}

// Exports a singleton of this class
export default new AlphaTabVariables();
