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
import { changeToSheetMusic, changePart } from "../../vendors/AlphaTab/actions";
import { getMyPart, getPartList } from "../../vendors/AlphaTab/actions";

// Style imports
import "./PracticeMusic.scss";

class PracticeMusic extends Component {
    // Component state
    state = {
        isLoading: true,
        currentPart: null,
        partList: null
    };

    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        // Initializes the AlphaTab API and displays the music
        initializeAPI();
        changeToSheetMusic()
            .then(() => {
                this.setState({
                    isLoading: false,
                    currentPart: getMyPart(),
                    partList: getPartList()
                });
            })
            .then(error => {
                console.log(error);
            });
    }

    onPartChangeHandler = newPart => {
        changePart(newPart);
        this.setState({ currentPart: newPart });
    };

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        // Returns the JSX to display
        return (
            <main>
                {!this.state.isLoading ? (
                    <PracticeMusicHeader
                        currentPart={this.state.currentPart}
                        partList={this.state.partList}
                        onPartChange={this.onPartChangeHandler}
                    />
                ) : null}
                <section id='alpha-tab-wrapper'>
                    <div id='sketch-holder'></div>
                    <div id='alpha-tab-container'></div>
                </section>
            </main>
        );
    }
}

export default PracticeMusic;
