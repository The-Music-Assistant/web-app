// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/initialization.js
// Description: Initializes AlphaTab (triggers AlphaTab to display sheet music)
// Author: Daniel Griessler & Dan Levy
// Email: dgriessler20@gmail.com & danlevy124@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// File imports
import player from "./default.sf2";
import * as highlightingOptions from "../P5/highlightingOptions";
import * as listeners from "./listeners";

export let api; // AlphaTab API
export let p5Obj; // Instance of p5 (drawing tool)
export let noteStream; // Stream of midi/durations for the expected performance for the green/yellow/red highlighting
export let noteStreamIndex; // Index into the note stream
export let cumulativeTime; // Cumulative time passed in song used with the note stream array
export let texLoaded; // Information about the alphaTex that is currently loaded
export let isFirstRender; // Boolean to distinguish between the first render and subsequent renders
export let barCount; // Number of bars to display at one time
export let shouldResetDrawPositions; // Boolean signaling to p5Obj to reset its draw position
export let drawer; // Instance of the p5 drawer which provides information about the last note heard for drawing
export let noteList; // Instance of note list providing an average measurement of the last midi value heard
export let highlightMeasures; // Enum signaling to sketch when it should highlight instead of normally draw feedback (TODO: This can be removed if we have two different p5 objects)
export let playerState; // Enum holding the current state of the player to avoid confusion during re-renders
export let getsFeedback; // Boolean indicating whether or not the user gets feedback
export let sheetMusicLength; // Number holding the length of the current sheet music (used for re-rendering in the performance overview page vs the exercise or sheet music view)
export let sketchBehavior;

/**
 * Initializes the AlphaTab API
 * Displays the piece of music on the screen
 */
const initializeAPI = () => {
    setInitialVariableValues();

    // AlphaTab API settings
    let settings = {
        player: {
            enablePlayer: true,
            enableCursor: true,
            soundFont: player,
            scrollElement: "#alpha-tab-wrapper"
        },
        display: {
            layoutMode: "horizontal",
            startBar: 1,
            barCount
        }
    };

    // Creates the AlphaTab API
    api = new window.alphaTab.platform.javaScript.AlphaTabApi(
        document.querySelector("#alpha-tab-container"),
        settings
    );

    // Listener executed when AlphaTab is rendered on the screen
    api.addPostRenderFinished(listeners.alphaTabPostRenderFinished);

    // Listener executed when the player state changes (e.g. play, pause, and stop)
    api.addPlayerStateChanged(listeners.alphaTabPlayerStateChanged);

    // Listener executed when the player finishes playing the song
    api.addPlayerFinished(listeners.alphaTabPlayerFinished);
};

/**
 * Sets global file variables to their initial values
 */
const setInitialVariableValues = () => {
    api = null;
    p5Obj = null;
    noteStream = [-1, 0];
    noteStreamIndex = 0;
    cumulativeTime = 0;
    texLoaded = null;
    isFirstRender = true;
    barCount = 20;
    shouldResetDrawPositions = true;
    drawer = null;
    noteList = null;
    highlightMeasures = highlightingOptions.HIGHLIGHT_OFF;
    playerState = 0;
    getsFeedback = false;
    sheetMusicLength = null;
};

export default initializeAPI;
