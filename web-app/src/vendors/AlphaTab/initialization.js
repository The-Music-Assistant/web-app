// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/initialization.js
// Description: Initializes AlphaTab (triggers AlphaTab to display sheet music)
// Author: Daniel Griessler & Dan Levy
// Email: dgriessler20@gmail.com & danlevy124@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

/**
 * Initializes AlphaTab (triggers AlphaTab to display sheet music)
 * @module initialization
 * @author Daniel Griessler <dgriessler20@gmail.com> & Dan Levy <danlevy124@gmail.com>
 */

// File imports
import atVars from "./variables";
import player from "./default.sf2";
import * as listeners from "./listeners";

/**
 * Initializes the AlphaTab API
 * Displays the piece of music on the screen
 */
const initializeAPI = () => {
    atVars.initialize();

    // AlphaTab API settings
    let settings = {
        player: {
            enablePlayer: true,
            enableCursor: true,
            soundFont: player,
            scrollElement: "#alpha-tab-wrapper",
            enableUserInteraction: false,
        },
        display: {
            layoutMode: "horizontal",
            startBar: 1,
            barCount: atVars.barCount,
        },
    };

    // Creates the AlphaTab API
    atVars.api = new window.alphaTab.platform.javaScript.AlphaTabApi(
        document.querySelector("#alpha-tab-container"),
        settings
    );

    // Listener executed when AlphaTab is rendered on the screen
    atVars.api.addPostRenderFinished(listeners.alphaTabPostRenderFinished);

    // Listener executed when the player state changes (e.g. play, pause, and stop)
    atVars.api.addPlayerStateChanged(listeners.alphaTabPlayerStateChanged);

    // Listener executed when the player finishes playing the song
    atVars.api.addPlayerFinished(listeners.alphaTabPlayerFinished);
};

export default initializeAPI;
