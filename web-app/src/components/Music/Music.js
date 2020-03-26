// ----------------------------------------------------------------------------
// File Path: src/components/Music/Music.js
// Description: Renders the Music component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// Component imports
import PracticeMusicHeader from "./PracticeMusicHeader/PracticeMusicHeader";
import MusicPerformancesHeader from "./MusicPerformancesHeader/MusicPerformancesHeader";
import PageHeader from "../PageHeader/PageHeader";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// File imports
import initializeAlphaTabApi from "../../vendors/AlphaTab/initialization";
import destroyAlphaTabApi from "../../vendors/AlphaTab/destruction";
import alphaTabVars from "../../vendors/AlphaTab/variables";
import {
    changeToSheetMusic,
    changePart,
    loadJustMyPart,
    loadTex
} from "../../vendors/AlphaTab/actions";
import { getMyPart, getPartList } from "../../vendors/AlphaTab/actions";
import setupPitchDetection from "../../vendors/ML5/PitchDetection/initialization";
import { sheetMusicError } from "../../vendors/Firebase/logs";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import * as musicPageOptions from "../Music/musicPageOptions";

// Style imports
import "./SheetMusic.scss";
import styles from "./Music.module.scss";

class Music extends Component {
    // Component state
    state = {
        // TODO: Change to true
        isLoading: false,
        currentPart: null,
        partList: null,
        isMicrophoneAvailable: true
    };

    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        // Initializes the AlphaTab API and displays the music
        this.prepareMusic()
            .then(() => {
                // Timeout gives extra time for the microphone and pitch detection to set up
                // There appears to be UI-blocking code even though the async code waits
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        currentPart: getMyPart(),
                        partList: ["Just My Part"].concat(getPartList())
                    });
                }, 2000);
            })
            .catch(error => {
                sheetMusicError(null, error, "[components/Music/componentDidMount]");
            });
    }

    /**
     * Initializes AlphaTab
     * Initializes pitch detection
     * Gets the piece of sheet music
     * Renders AlphaTab
     * @returns - A promise
     */
    prepareMusic = async () => {
        initializeAlphaTabApi();
        return Promise.all([
            this.initializePitchDetection(),
            changeToSheetMusic(),
            this.waitForAlphaTabToRender()
        ]);
    };

    /**
     * Sets up ML5 pitch detection
     */
    initializePitchDetection = async () => {
        // Prepares for microphone input sets up the pitch detection model
        try {
            await setupPitchDetection();
        } catch (error) {
            this.props.showAlert(
                alertBarTypes.WARNING,
                "No Microphone",
                "Please connect a microphone and/or give us permission to access your microphone. Music playback is still allowed, but a microphone is required for feedback."
            );
            this.setState({ isMicrophoneAvailable: false });
            sheetMusicError(null, error, "[components/Music/initializePitchDetection]");
        }
    };

    /**
     * Waits for AlphaTab to render
     */
    waitForAlphaTabToRender = () => {
        return new Promise(resolve => {
            alphaTabVars.api.addPostRenderFinished(resolve);
        });
    };

    /**
     * Destroys the AlphaTab API
     * Removes the P5 drawer
     * Stops pitch detection
     */
    componentWillUnmount() {
        destroyAlphaTabApi();
    }

    /**
     * Destroys the AlphaTab API before going back a page
     */
    backButtonClickedHandler = () => {
        this.props.history.goBack();
    };

    /**
     * Changes the track number on AlphaTab to the new partIndex
     * Updates state to reflect the new part value
     * @param index - The index of the selected part based on the original array
     * @param value - The value (name) of the selected part
     */
    onPartChangeHandler = (index, value) => {
        if (this.state.currentPart === "Just My Part") {
            if (index === 0) {
                // Clicked on current value (no need to change)
                return;
            } else {
                // Switches back to all sheet music
                loadTex(value);
            }
        } else if (index === 0) {
            // Loads just my part
            loadJustMyPart();
        } else {
            // "Just My Part" option is not directly included in the track list, but is the first option (index 0), so we need index - 1
            changePart(`t${index - 1}`);
        }

        this.setState({ currentPart: value });
    };

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        let component;

        if (this.state.isLoading) {
            component = (
                <div className={styles.musicLoadingContainer}>
                    <LoadingContainer message='Loading music...' />
                </div>
            );
        } else if (this.props.pageType === musicPageOptions.PRACTICE) {
            component = (
                <PracticeMusicHeader
                    currentPart={this.state.currentPart}
                    partList={this.state.partList}
                    onPartChange={this.onPartChangeHandler}
                />
            );
        } else if (this.props.pageType === musicPageOptions.PERFORMANCES) {
            component = <MusicPerformancesHeader />;
        }

        // Returns the JSX to display
        return (
            <main className={styles.music}>
                <PageHeader
                    heading={
                        this.state.isMicrophoneAvailable
                            ? "Practice"
                            : "Playback - No Microphone Available"
                    }
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Music Selection"}
                    backButtonClickedHandler={this.backButtonClickedHandler}
                />
                {component}
                <section id='alpha-tab-wrapper'>
                    <div id='sketch-holder'></div>
                    <div id='alpha-tab-container'></div>
                </section>
            </main>
        );
    }
}

// Prop types for the Music component
Music.propTypes = {
    showAlert: PropTypes.func.isRequired,
    pageType: PropTypes.oneOf([
        musicPageOptions.PRACTICE,
        musicPageOptions.PERFORMANCES,
        musicPageOptions.EXERCISE
    ])
};

export default withRouter(Music);
