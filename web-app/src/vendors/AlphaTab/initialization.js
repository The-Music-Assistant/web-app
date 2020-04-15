// File imports
import atVars from "./variables";
import player from "./default.sf2";
import * as listeners from "./listeners";

/**
 * Initializes AlphaTab (triggers AlphaTab to display sheet music)
 * @module alphaTabInitialization
 * @author Daniel Griessler <dgriessler20@gmail.com>
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Initializes the AlphaTab API.
 * Displays the piece of music on the screen.
 * @function
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
