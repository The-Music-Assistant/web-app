// File imports
import * as sketchBehaviors from "../P5/sketchBehaviors";

/**
 * @class
 * @classdesc AlphaTab variables
 * @author Daniel Griessler <dgriessler20@gmail.com>
 * @author Dan Levy <danlevy124@gmail.com>
 */
class AlphaTabVariables {
    /**
     *AlphaTab API
     */
    api;

    /**
     * Instance of p5 (drawing tool)
     */
    p5Obj;

    /**
     * Stream of midi/durations for the expected performance for the green/yellow/red highlighting
     */
    noteStream;

    /**
     * Index into the note stream
     */
    noteStreamIndex;

    /**
     * Cumulative time passed in song used with the note stream array
     */
    cumulativeTime;

    /**
     * Information about the alphaTex that is currently loaded
     */
    texLoaded;

    /**
     * Boolean to distinguish between the first render and subsequent renders
     */
    isFirstRender;

    /**
     * Number of bars to display at one time
     */
    barCount;

    /**
     * Boolean signaling to p5Obj to reset its draw position
     */
    shouldResetDrawPositions;

    /**
     * Instance of the p5 drawer which provides information about the last note heard for drawing
     */
    drawer;

    /**
     * Instance of note list providing an average measurement of the last midi value heard
     */
    noteList;

    /**
     * Enum holding the current state of the player to avoid confusion during re-renders
     */
    playerState;

    /**
     * Boolean indicating whether or not the user gets feedback
     */
    getsFeedback;

    /**
     * Number holding the length of the current sheet music (used for re-rendering in the performance overview page vs the exercise or sheet music view)
     */
    sheetMusicLength;

    /**
     * Enum indicating which sketch behavior should be followed based on the current page (e.g. real-time feedback or performance)
     */
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
        this.playerState = 0;
        this.getsFeedback = false;
        this.sheetMusicLength = null;
        this.sketchBehavior = sketchBehaviors.REAL_TIME_FEEDBACK;
    };
}

// Exports a singleton of this class
export default new AlphaTabVariables();
