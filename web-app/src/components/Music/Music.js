// ----------------------------------------------------------------------------
// File Path: src/components/Music/Music.js
// Description: Renders the Music component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component, createRef } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
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
    changeToExercise,
    stopPlayingMusic,
} from "../../vendors/AlphaTab/actions";
import { getMyPart, getPartList } from "../../vendors/AlphaTab/actions";
import setupPitchDetection from "../../vendors/ML5/PitchDetection/initialization";
import { sheetMusicError } from "../../vendors/Firebase/logs";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import * as musicPageOptions from "./musicPageOptions";
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
        hasAlreadyRenderedOnce: false,
        pageType: null,
    };

    _isMounted = false; // Indicates whether the component is mounted
    _alphaTabWrapperRef = createRef(); // A reference to the AlphaTab wrapper element

    /**
     * Initializes the AlphaTab API
     * Initializes pitch detection
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        this._isMounted = true;
        initializeAlphaTabApi();
        alphaTabVars.getsFeedback = this.props.doesUserGetFeedback;
        alphaTabVars.api.addPostRenderFinished(this.alphaTabRendered);
        if (this.props.doesUserGetFeedback) {
            this.initializePitchDetection();
        } else {
            this.setState({
                isPitchDetectionLoading: false,
                isMicrophoneAvailable: false,
            });
        }
        this.prepareMusic();
    }

    static getDerivedStateFromProps(newProps) {
        return {
            pageType: newProps.location.pathname.substring(
                newProps.location.pathname.lastIndexOf("/") + 1
            ),
        };
    }

    componentDidUpdate(_, prevState) {
        if (prevState.pageType !== this.state.pageType) {
            this.prepareMusic();
        }
    }

    /**
     * Destroys the AlphaTab API
     * Removes the P5 drawer
     * Stops pitch detection
     */
    componentWillUnmount() {
        this._isMounted = false;
        destroyAlphaTabApi();
        alphaTabVars.api.removePostRenderFinished(this.alphaTabRendered);
    }

    alphaTabRendered = () => {
        if (this._isMounted) this.setState({ isAlphaTabLoading: false });
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
        if (this._isMounted) this.setState({ isAlphaTabLoading: true, isDataLoading: true });
        let loadSheetMusic;

        // Chooses the correct sheet music and drawing based on the given pageType prop
        switch (this.state.pageType) {
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
                    `${this.state.pageType} is not valid. See musicPageOptions.js for options. No music was loaded.`
                );
        }

        try {
            await loadSheetMusic();

            if (this.state.pageType === musicPageOptions.EXERCISE) {
                this.props.exerciseGenerated();
            }

            if (this._isMounted)
                this.setState({
                    isDataLoading: false,
                    currentPart: getMyPart(),
                    partList: ["Just My Part"].concat(getPartList()),
                    numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString(),
                });
        } catch (error) {
            sheetMusicError(error.response.status, error.response.data, ["Music/prepareMusic"]);
        }
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
            setTimeout(() => {
                if (this._isMounted)
                    this.setState({
                        isPitchDetectionLoading: false,
                        isMicrophoneAvailable: true,
                    });
            }, 2000);
        } catch (error) {
            this.props.showAlert(
                alertBarTypes.WARNING,
                "No Microphone",
                "Please connect a microphone and/or give us permission to access your microphone. Music playback is still allowed, but a microphone is required for feedback."
            );
            if (this._isMounted)
                this.setState({
                    isPitchDetectionLoading: false,
                    isMicrophoneAvailable: false,
                });
            sheetMusicError(null, error, "[components/Music/initializePitchDetection]");
        }
    };

    /**
     * Destroys the AlphaTab API before going back a page
     */
    backButtonClickedHandler = () => {
        this.props.history.goBack();
    };

    switchToNewMusicPage = (pageType) => {
        this.updateMusicPage();
        const routeUrl = this.getNewUrl(pageType);
        this.props.history.replace(routeUrl);
    };

    updateMusicPage = () => {
        stopPlayingMusic();
        this._alphaTabWrapperRef.current.scrollLeft = 0;
        if (this._isMounted) this.setState({ isAlphaTabLoading: true, isDataLoading: true });
    };

    getNewUrl = (pageType) => {
        return `${this.props.location.pathname.substring(
            0,
            this.props.location.pathname.lastIndexOf("/")
        )}/${pageType}`;
    };

    /**
     * Changes the track number on AlphaTab to the new partIndex
     * Updates state to reflect the new part value
     * @param index - The index of the selected part based on the original array
     * @param value - The value (name) of the selected part
     */
    onPartChangeHandler = async (index, value) => {
        this.updateMusicPage();
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

        if (this._isMounted)
            this.setState({
                isDataLoading: false,
                currentPart: value,
                numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString(),
            });
    };

    getLoadingComponent = () => {
        let message;
        switch (this.state.pageType) {
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

        return (
            <div className={styles.musicLoadingContainer}>
                <LoadingContainer message={message} />
            </div>
        );
    };

    getPageHeaderComponent = () => {
        const matchUrl = this.props.match.url;
        return (
            <Switch>
                <Route path={`${matchUrl}/practice`}>
                    <PracticeMusicHeader
                        pageType={this.state.pageType}
                        currentPart={this.state.currentPart}
                        partList={this.state.partList}
                        onPartChange={this.onPartChangeHandler}
                        switchToPerformance={() =>
                            this.switchToNewMusicPage(musicPageOptions.PERFORMANCE)
                        }
                        doesUserGetFeedback={this.props.doesUserGetFeedback}
                    />
                </Route>
                <Route path={`${matchUrl}/performance`}>
                    <MusicPerformanceHeader
                        numberOfMeasures={this.state.numberOfMeasures}
                        switchToPractice={() =>
                            this.switchToNewMusicPage(musicPageOptions.PRACTICE)
                        }
                        switchToExercise={() =>
                            this.switchToNewMusicPage(musicPageOptions.EXERCISE)
                        }
                    />
                </Route>
                <Route path={`${matchUrl}/exercise`}>
                    <PracticeMusicHeader
                        pageType={this.state.pageType}
                        switchToPractice={() =>
                            this.switchToNewMusicPage(musicPageOptions.PRACTICE)
                        }
                        switchToPerformance={() =>
                            this.switchToNewMusicPage(musicPageOptions.PERFORMANCE)
                        }
                        doesUserGetFeedback={true}
                    />
                </Route>
            </Switch>
        );
    };

    getPageHeading = () => {
        switch (this.state.pageType) {
            case musicPageOptions.PRACTICE:
                if (this.props.doesUserGetFeedback) {
                    return this.state.isMicrophoneAvailable
                        ? "Practice"
                        : "Playback - No Microphone Available";
                } else {
                    return "Practice - No Feedback";
                }

            case musicPageOptions.PERFORMANCE:
                return "Performance";
            case musicPageOptions.EXERCISE:
                return this.state.isMicrophoneAvailable
                    ? `Exercise (Measures ${this.props.exercise.startMeasure} - ${this.props.exercise.endMeasure})`
                    : `Exercise Playback (Measures ${this.props.exercise.startMeasure} - ${this.props.exercise.endMeasure}) - No Microphone Available`;
            default:
                return "Practice";
        }
    };

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        const isLoading =
            this.state.isAlphaTabLoading ||
            this.state.isPitchDetectionLoading ||
            this.state.isDataLoading;
        let component = isLoading ? this.getLoadingComponent() : this.getPageHeaderComponent();

        // Returns the JSX to display
        return (
            <main className={styles.music}>
                <PageHeader
                    heading={this.getPageHeading()}
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Music Selection"}
                    backButtonClickedHandler={this.backButtonClickedHandler}
                />
                <div className={styles.musicMain}>
                    {component}
                    <section id='alpha-tab-wrapper' ref={this._alphaTabWrapperRef}>
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
    exercise: PropTypes.shape({
        startMeasure: PropTypes.string,
        endMeasure: PropTypes.string,
    }),
};

/**
 * Gets the current state from Redux and passes it to the Music component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = (state) => {
    return {
        exercise: state.practice.exercise,
        doesUserGetFeedback: state.practice.doesUserGetFeedback,
    };
};

/**
 * Passes certain redux actions to the Music component
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = (dispatch) => {
    return {
        exerciseGenerated: () => dispatch(exerciseGenerated()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Music));
