// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMusic/PracticeMusic.js
// Description: Renders the practice music component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";

// Component imports
import PracticeMusicHeader from "./PracticeMusicHeader/PracticeMusicHeader";

// File imports
import initializeAPI from "../../vendors/AlphaTab/initialization";
import { changeMusic } from "../../vendors/AlphaTab/actions";

// Style imports
import "./PracticeMusic.scss";

class PracticeMusic extends Component {
    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        // Initializes the AlphaTab API and displays the music
        initializeAPI();
        changeMusic("sheetMusic");
    }

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        // Returns the JSX to display
        return (
            <main>
                <PracticeMusicHeader />
                <section id='alpha-tab-wrapper'>
                    <div id='sketch-holder'></div>
                    <div id='alpha-tab-container'></div>
                </section>
            </main>
        );
    }
}

export default PracticeMusic;
