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
import * as musicViewOptions from "./musicViewOptions";
import { exerciseGenerated } from "../../store/actions";

// Style imports
import "./SheetMusic.scss";
import styles from "./Music.module.scss";

/**
 * Renders the Music component.
 * This component handles practicing music, viewing performance, and practicing an exercise.
 * @component
 * @category Music
 * @author Dan Levy <danlevy124@gmail.com>
 */
class Music extends Component {
    /**
     * Music component state
     * @property {boolean} isAlphaTabLoading - Indicates if AlphaTab is in a loading state
     * @property {boolean} isPitchDetectionLoading - Indicates if pitch detection is in a loading state
     * @property {boolean} isDataLoading - Indicates if data is being downloaded
     * @property {object} currentPart - The currently selected part (track) of the sheet music (e.g. Alto)
     * @property {array} partList - The list of all available parts (tracks) for the sheet music
     * @property {boolean} isMicrophoneAvailable - Indicates if a microphone is available for use
     * @property {string} numberOfMeasures - The number of measures in the sheet music
     * @property {module:musicViewOptions} currentView - The current view that this component is displaying (e.g. performance)
     */
    state = {
        isAlphaTabLoading: true,
        isPitchDetectionLoading: true,
        isDataLoading: true,
        currentPart: null,
        partList: null,
        isMicrophoneAvailable: true,
        numberOfMeasures: "0",
        currentView: null,
    };

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @type {boolean}
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     */
    _isMounted = false;

    /**
     * A reference to the AlphaTab wrapper element.
     * Uses a React Ref.
     */
    _alphaTabWrapperRef = createRef();

    /**
     * Sets _isMounted to true.
     * Initializes the AlphaTab API.
     * Initializes pitch detection.
     * Prepares the music.
     */
    componentDidMount() {
        this._isMounted = true;

        initializeAlphaTabApi();
        alphaTabVars.api.addPostRenderFinished(this.alphaTabDidRender);

        this.initializePitchDetection();

        this.prepareMusic();
    }

    /**
     * Determines the current view based on the current url
     */
    static getDerivedStateFromProps(newProps) {
        // Gets the string after the last forward slash (/) in the url and sets it to be the page type
        return {
            currentView: newProps.location.pathname.substring(
                newProps.location.pathname.lastIndexOf("/") + 1
            ),
        };
    }

    /**
     * Prepares the music again if the current view changed.
     * @param {object} _ The previous component props
     * @param {object} prevState The previous component state
     */
    componentDidUpdate(_, prevState) {
        if (prevState.currentView !== this.state.currentView) {
            this.prepareMusic();
        }
    }

    /**
     * Destroys the AlphaTab API
     */
    componentWillUnmount() {
        this._isMounted = false;
        destroyAlphaTabApi();
        alphaTabVars.api.removePostRenderFinished(this.alphaTabDidRender);
    }

    /**
     * Updates state when AlphaTab is done rendering
     * @function
     */
    alphaTabDidRender = () => {
        if (this._isMounted) {
            this.setState({ isAlphaTabLoading: false });
        }
    };

    /**
     * Gets the piece of sheet music.
     * Renders AlphaTab.
     * @function
     * @async
     * @returns {Promise} A promise
     */
    prepareMusic = async () => {
        if (this._isMounted) {
            this.setState({ isAlphaTabLoading: true, isDataLoading: true });
        }
        let loadSheetMusic;

        // Chooses the correct sheet music and drawing based on the given currentView prop
        switch (this.state.currentView) {
            case musicViewOptions.PRACTICE:
                loadSheetMusic = changeToSheetMusic;
                break;
            case musicViewOptions.PERFORMANCE:
                loadSheetMusic = changeToPerformance;
                break;
            case musicViewOptions.EXERCISE:
                loadSheetMusic = changeToExercise.bind(
                    this,
                    parseInt(this.props.exercise.startMeasure, 10),
                    parseInt(this.props.exercise.endMeasure, 10)
                );
                break;
            default:
                console.log(
                    `${this.state.currentView} is not valid. See musicViewOptions.js for options. No music was loaded.`
                );
        }

        try {
            // Loads the sheet music
            await loadSheetMusic();

            if (this.state.currentView === musicViewOptions.EXERCISE) {
                // Tells Redux that an exercise has been generated
                this.props.exerciseGenerated();
            }

            // Updates state with the sheet music data
            if (this._isMounted) {
                this.setState({
                    isDataLoading: false,
                    currentPart: getMyPart(),
                    partList: ["Just My Part"].concat(getPartList()),
                    numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString(),
                });
            }
        } catch (error) {
            // Logs an error
            sheetMusicError(null, error, "[Music/prepareMusic]");

            // Shows an alert
            this.props.showAlert(
                alertBarTypes.ERROR,
                "Error",
                "We can't load the sheet music right now. Please try again later."
            );
        }
    };

    /**
     * Sets up ML5 pitch detection
     * @function
     * @async
     * @returns {Promise} A promise
     */
    initializePitchDetection = async () => {
        // Prepares for microphone input sets up the pitch detection model
        try {
            // Sets up pitch detection
            await setupPitchDetection();

            // Timeout gives extra time for the microphone and pitch detection to set up
            // There appears to be UI-blocking code even though the async code waits
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({
                        isPitchDetectionLoading: false,
                        isMicrophoneAvailable: true,
                    });
                }
            }, 2000);
        } catch (error) {
            // Logs an error
            sheetMusicError(
                null,
                error,
                "[components/Music/initializePitchDetection]"
            );

            // Shows an alert
            this.props.showAlert(
                alertBarTypes.WARNING,
                "No Microphone",
                "Please connect a microphone and/or give us permission to access your microphone. Music playback is still allowed, but a microphone is required for feedback."
            );

            // Updates state
            if (this._isMounted) {
                this.setState({
                    isPitchDetectionLoading: false,
                    isMicrophoneAvailable: false,
                });
            }
        }
    };

    /**
     * Switches to a new music page.
     * See [options]{@link module:musicViewOptions}.
     * @function
     * @param {module:musicViewOptions} newView - The view to switch to
     */
    switchToNewMusicPage = (newView) => {
        // Prepares for a sheet music update
        this.prepareForSheetMusicUpdate();

        // Updates the URL
        const routeUrl = this.getNewUrl(newView);
        this.props.history.replace(routeUrl);
    };

    /**
     * Prepares for a page switch.
     * Updates AlphaTab and updates state.
     * @function
     */
    prepareForSheetMusicUpdate = () => {
        // Stops playing the music
        stopPlayingMusic();

        // Moves the sheet music back to the beginning (measure 1)
        this._alphaTabWrapperRef.current.scrollLeft = 0;

        // Updates state
        if (this._isMounted) {
            this.setState({ isAlphaTabLoading: true, isDataLoading: true });
        }
    };

    /**
     * Gets a new URL based on the new view
     * @function
     * @param {module:musicViewOptions} newView - The view that is being switched to
     */
    getNewUrl = (newView) => {
        // Replaces the string after the last forward slash (/) in the url with the new page type
        return `${this.props.location.pathname.substring(
            0,
            this.props.location.pathname.lastIndexOf("/")
        )}/${newView}`;
    };

    /**
     * Changes the track number in AlphaTab to the new index.
     * Updates state to reflect the new part value.
     * @function
     * @param {number} index - The index of the selected part based on the select input
     * @param {string} value - The value (name) of the selected part
     */
    onPartChangeHandler = async (index, value) => {
        // Prepares for a sheet music update
        this.prepareForSheetMusicUpdate();

        if (this.state.currentPart === "Just My Part") {
            // Because the current part removed all other parts from the music, we need to reload those other parts
            // NOTE: The current part is not the new part (the new part is "value")
            await loadTex(value);
        } else if (index === 0) {
            // Loads "just my part"
            await loadJustMyPart();
        } else {
            // Changes the part
            // Because the "Just My Part" option is not directly included in the track list, but is the first option in the select menu (index 0), we need to get index - 1 from the track list
            await changePart(`t${index - 1}`);
        }

        // Updates state with the new part
        if (this._isMounted) {
            this.setState({
                isDataLoading: false,
                currentPart: value,
                numberOfMeasures: alphaTabVars.texLoaded.measureLengths.length.toString(),
            });
        }
    };

    /**
     * Gets a loading component
     * @function
     * @returns A loading component (JSX)
     */
    getLoadingComponent = () => {
        // Gets the loading message
        let message;
        switch (this.state.currentView) {
            case musicViewOptions.PRACTICE:
                message = "Loading music...";
                break;
            case musicViewOptions.PERFORMANCE:
                message = "Loading performance...";
                break;
            case musicViewOptions.EXERCISE:
                message = "Loading exercise...";
                break;
            default:
                message = "Loading music...";
        }

        // Returns the loading component
        return (
            <section className={styles.musicLoadingContainer}>
                <LoadingContainer message={message} />
            </section>
        );
    };

    /**
     * Gets a music header component
     * @function
     * @returns A music header component (JSX)
     */
    getMusicHeaderComponent = () => {
        // Gets the match url from React Router
        // The match url is the url that has been matched so far (this is a nested route)
        const matchUrl = this.props.match.url;

        // Returns the correct page header based on the url
        return (
            <Switch>
                {/* Shows the practice music header component */}
                <Route path={`${matchUrl}/practice`}>
                    <PracticeMusicHeader
                        currentView={this.state.currentView}
                        currentPart={this.state.currentPart}
                        partList={this.state.partList}
                        onPartChange={this.onPartChangeHandler}
                        switchToPerformance={() =>
                            this.switchToNewMusicPage(
                                musicViewOptions.PERFORMANCE
                            )
                        }
                    />
                </Route>

                {/* Shows the music performance header component */}
                <Route path={`${matchUrl}/performance`}>
                    <MusicPerformanceHeader
                        numberOfMeasures={this.state.numberOfMeasures}
                        switchToPractice={() =>
                            this.switchToNewMusicPage(musicViewOptions.PRACTICE)
                        }
                        switchToExercise={() =>
                            this.switchToNewMusicPage(musicViewOptions.EXERCISE)
                        }
                    />
                </Route>

                {/* Shows the practice music header component */}
                <Route path={`${matchUrl}/exercise`}>
                    <PracticeMusicHeader
                        currentView={this.state.currentView}
                        switchToPractice={() =>
                            this.switchToNewMusicPage(musicViewOptions.PRACTICE)
                        }
                        switchToPerformance={() =>
                            this.switchToNewMusicPage(
                                musicViewOptions.PERFORMANCE
                            )
                        }
                    />
                </Route>
            </Switch>
        );
    };

    /**
     * Gets a page heading
     * @function
     * @returns {string} A page heading
     */
    getPageHeading = () => {
        switch (this.state.currentView) {
            case musicViewOptions.PRACTICE:
                return this.state.isMicrophoneAvailable
                    ? "Practice"
                    : "Playback - No Microphone Available";
            case musicViewOptions.PERFORMANCE:
                return "Performance";
            case musicViewOptions.EXERCISE:
                return this.state.isMicrophoneAvailable
                    ? `Exercise (Measures ${this.props.exercise.startMeasure} - ${this.props.exercise.endMeasure})`
                    : `Exercise Playback (Measures ${this.props.exercise.startMeasure} - ${this.props.exercise.endMeasure}) - No Microphone Available`;
            default:
                return "Practice";
        }
    };

    /**
     * Renders the Music component.
     * The sketch and AlphaTab are not handled by React, but rather by via direct DOM manipulation.
     * See the vendors folder for the P5 (sketch) code and the AlphaTab code
     */
    render() {
        // Combines loading states into one isLoading boolean
        const isLoading =
            this.state.isAlphaTabLoading ||
            this.state.isPitchDetectionLoading ||
            this.state.isDataLoading;

        // Gets the correct component (either loading component or music header component)
        let loadingOrMusicHeaderComponent = isLoading
            ? this.getLoadingComponent()
            : this.getMusicHeaderComponent();

        // Returns the JSX to display
        return (
            <main className={styles.music}>
                {/* Page header */}
                <PageHeader
                    heading={this.getPageHeading()}
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Music Selection"}
                />

                {/* Music inner container */}
                <section className={styles.musicInnerContainer}>
                    {/* A loading component or a music header component */}
                    {loadingOrMusicHeaderComponent}

                    {/* These elements are not handled directly by React (see vendors folder for code) */}
                    <section
                        id="alpha-tab-wrapper"
                        ref={this._alphaTabWrapperRef}
                    >
                        {/* Sketch (real-time feedback or performance highlighting) */}
                        <div id="sketch-holder"></div>

                        {/* Sheet music */}
                        <div id="alpha-tab-container"></div>
                    </section>
                </section>
            </main>
        );
    }
}

// Prop types for the Music component
Music.propTypes = {
    /**
     * The current URL data.
     * This is provided by the withRouter function.
     */
    location: PropTypes.object.isRequired,

    /**
     * The history object.
     * This is provided by the withRouter function.
     */
    history: PropTypes.object.isRequired,

    /**
     * The matched URL.
     * This is provided by the withRouter function.
     */
    match: PropTypes.object.isRequired,

    /**
     * The requested exercise measures (if an exercise was requested)
     */
    exercise: PropTypes.shape({
        startMeasure: PropTypes.string,
        endMeasure: PropTypes.string,
    }),

    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,

    /**
     * Tells Redux that the requested exercise has been generated
     */
    exerciseGenerated: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the Music component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Music
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the Music component
 */
const mapStateToProps = (state) => {
    return {
        exercise: state.practice.exercise,
    };
};

/**
 * Passes certain Redux actions to the Music component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Music
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the Music component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        exerciseGenerated: () => dispatch(exerciseGenerated()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Music));
