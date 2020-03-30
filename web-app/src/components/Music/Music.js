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
import { connect } from "react-redux";

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
import { exerciseGenerated } from "../../store/actions";

// Style imports
import "./SheetMusic.scss";
import styles from "./Music.module.scss";

class Music extends Component {
    // Component state
    state = {
        isAlphaTabLoading: true,
        isPitchDetectionLoading: true,
        isDataLoading: true,
        currentPart: null,
        partList: null,
        isMicrophoneAvailable: true,
        numberOfMeasures: "0",
        hasAlreadyRenderedOnce: false
    };

    /**
     * Initializes the AlphaTab API
     * Initializes pitch detection
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        initializeAlphaTabApi();
        alphaTabVars.api.addPostRenderFinished(this.alphaTabRendered);
        this.initializePitchDetection();
        this.prepareMusic();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pageType !== this.props.pageType) {
            this.prepareMusic();
        }
    }
    /**
     * Destroys the AlphaTab API
     * Removes the P5 drawer
     * Stops pitch detection
     */
    componentWillUnmount() {
        destroyAlphaTabApi();
        alphaTabVars.api.removePostRenderFinished(this.alphaTabRendered);
    }

    alphaTabRendered = () => {
        this.setState({ isAlphaTabLoading: false });
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
        this.setState({ isAlphaTabLoading: true, isDataLoading: true });
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
                    parseInt(this.props.exercise.startMeasure, 10),
                    parseInt(this.props.exercise.endMeasure, 10)
                );
                break;
            default:
                console.log(
                    `${this.props.pageType} is not valid. See musicPageOptions.js for options. No music was loaded.`
                );
        }

        await loadSheetMusic();

        if (this.props.pageType === musicPageOptions.EXERCISE) {
            this.props.exerciseGenerated();
        }

        this.setState({
            isDataLoading: false,
            currentPart: getMyPart(),
            partList: ["Just My Part"].concat(getPartList()),
            numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString()
        });
    };

    /**
     * Sets up ML5 pitch detection
     */
    initializePitchDetection = async () => {
        // Prepares for microphone input sets up the pitch detection model
        try {
            await setupPitchDetection();
            // Timeout gives extra time for the microphone and pitch detection to set up
            // There appears to be UI-blocking code even though the async code waits
            setTimeout(
                () =>
                    this.setState({
                        isPitchDetectionLoading: false,
                        isMicrophoneAvailable: true
                    }),
                2000
            );
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
    onPartChangeHandler = async (index, value) => {
        this.setState({ isAlphaTabLoading: true, isDataLoading: true });
        if (this.state.currentPart === "Just My Part") {
            // Switches back to all sheet music
            await loadTex(value);
        } else if (index === 0) {
            // Loads just my part
            await loadJustMyPart();
        } else {
            // "Just My Part" option is not directly included in the track list, but is the first option (index 0), so we need index - 1
            await changePart(`t${index - 1}`);
        }

        this.setState({
            isDataLoading: false,
            currentPart: value,
            numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString()
        });
    };

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        let component;
        let pageHeading;
        const isLoading =
            this.state.isAlphaTabLoading ||
            this.state.isPitchDetectionLoading ||
            this.state.isDataLoading;

        if (isLoading) {
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
                    pageType={this.props.pageType}
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
        } else if (this.props.pageType === musicPageOptions.EXERCISE) {
            component = <PracticeMusicHeader pageType={this.props.pageType} />;

            pageHeading = this.state.isMicrophoneAvailable
                ? `Exercise (Measures ${this.props.exercise.startMeasure} - ${this.props.exercise.endMeasure})`
                : `Exercise Playback (Measures ${this.props.exercise.startMeasure} - ${this.props.exercise.endMeasure}) - No Microphone Available`;
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
                <div className={styles.musicMain}>
                    {component}
                    <section id='alpha-tab-wrapper'>
                        <div id='sketch-holder'></div>
                        <div id='alpha-tab-container'></div>
                    </section>
                </div>
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

/**
 * Gets the current state from Redux and passes it to the Music component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        exercise: state.practice.exercise
    };
};

/**
 * Passes certain redux actions to the Music component
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        exerciseGenerated: () => dispatch(exerciseGenerated())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Music));
