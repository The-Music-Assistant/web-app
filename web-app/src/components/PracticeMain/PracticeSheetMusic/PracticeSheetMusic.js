// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeSheetMusic/PracticeSheetMusic.js
// Description: Renders the practice sheet music component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";

// File imports
import AlphaTabAPIUtility from "./AlphaTabAPIUtility";
import AlphaTabRunner from "./AlphaTabRunner";

// Style imports
// TODO: Move to CSS modules
import "./PracticeSheetMusic.scss";

class PracticeSheetMusic extends Component {
    state = {
        utilAPI: null
    };

    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        // Initializes the AlphaTab API and displays the music
        AlphaTabRunner.initializeAPI();

        // TODO: What is utilAPI and does it need to be in this component's state?
        this.setState({
            utilAPI: new AlphaTabAPIUtility(
                AlphaTabRunner.api,
                AlphaTabRunner.currentTrackIndexes,
                AlphaTabRunner.totalTracks
            )
        });
    }

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        // Returns the JSX to display
        return (
            <section id='wrapper'>
                <div id='sketch-holder'></div>
                <div id='alpha-tab-container'></div>
            </section>
        );
    }
}

export default PracticeSheetMusic;
