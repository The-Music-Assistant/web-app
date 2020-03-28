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
import MusicPerformanceHeader from "./MusicPerformanceHeader/MusicPerformanceHeader";
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
    loadTex,
    changeToPerformance,
    changeToExercise
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
        isLoading: true,
        currentPart: null,
        partList: null,
        isMicrophoneAvailable: true,
        numberOfMeasures: "0",
        hasAlreadyRenderedOnce: false
    };

    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        this.getMusic();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pageType !== this.props.pageType) {
            this.setState({ isLoading: true });
            this.getMusic();
        }
    }

    getMusic = () => {
        // Initializes the AlphaTab API and displays the music
        this.prepareMusic()
            .then(() => {
                // Timeout gives extra time for the microphone and pitch detection to set up
                // There appears to be UI-blocking code even though the async code waits
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                        currentPart: getMyPart(),
                        partList: ["Just My Part"].concat(getPartList()),
                        numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString()
                    });
                }, 2000);
            })
            .catch(error => {
                sheetMusicError(null, error, "[components/Music/componentDidMount]");
            });
    };

    /**
     * Initializes AlphaTab
     * Initializes pitch detection
     * Initializes the drawer
     * Gets the piece of sheet music
     * Renders AlphaTab
     * @returns - A promise
     */
    prepareMusic = async () => {
        let loadSheetMusic;

        // Chooses the correct sheet music and drawing based on the given pageType prop
        switch (this.props.pageType) {
            case musicPageOptions.PRACTICE:
                loadSheetMusic = changeToSheetMusic;
                break;
            case musicPageOptions.PERFORMANCE:
                loadSheetMusic = changeToPerformance;
                break;
            case musicPageOptions.EXERCISE:
                loadSheetMusic = changeToExercise.bind(
                    this,
                    this.props.exerciseStartMeasure,
                    this.props.exerciseEndMeasure
                );
                break;
            default:
                console.log(
                    `${this.props.pageType} is not valid. See musicPageOptions.js for options. No music was loaded.`
                );
        }

        // Initializes the sheet music, pitch detection, and drawer
        if (!this.state.hasAlreadyRenderedOnce) {
            initializeAlphaTabApi();
        }
        return Promise.all([
            this.initializePitchDetection(),
            loadSheetMusic(),
            this.waitForAlphaTabToRender()
        ]);
    };

    /**
     * Sets up ML5 pitch detection
     */
    initializePitchDetection = async () => {
        if (!this.state.hasAlreadyRenderedOnce) {
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

            this.setState({ hasAlreadyRenderedOnce: true });
        } else {
            return;
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
        let pageHeading;

        if (this.state.isLoading) {
            let message;
            switch (this.props.pageType) {
                case musicPageOptions.PRACTICE:
                    message = "Loading music...";
                    break;
                case musicPageOptions.PERFORMANCE:
                    message = "Loading performance...";
                    break;
                case musicPageOptions.EXERCISE:
                    message = "Loading exercise...";
                    break;
                default:
                    message = "Loading music...";
            }

            component = (
                <div className={styles.musicLoadingContainer}>
                    <LoadingContainer message={message} />
                </div>
            );

            pageHeading = "Practice";
        } else if (this.props.pageType === musicPageOptions.PRACTICE) {
            component = (
                <PracticeMusicHeader
                    currentPart={this.state.currentPart}
                    partList={this.state.partList}
                    onPartChange={this.onPartChangeHandler}
                />
            );

            pageHeading = this.state.isMicrophoneAvailable
                ? "Practice"
                : "Playback - No Microphone Available";
        } else if (this.props.pageType === musicPageOptions.PERFORMANCE) {
            component = <MusicPerformanceHeader numberOfMeasures={this.state.numberOfMeasures} />;

            pageHeading = "Performance";
        }

        // Returns the JSX to display
        return (
            <main className={styles.music}>
                <PageHeader
                    heading={pageHeading}
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
        musicPageOptions.PERFORMANCE,
        musicPageOptions.EXERCISE
    ]),
    exerciseStartMeasure: PropTypes.number,
    exerciseEndMeasure: PropTypes.number
};

export default withRouter(Music);
