// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/MusicControls/MusicControls.js
// Description: Renders the music controls component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/24/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// File imports
import atVars from "../../../../vendors/AlphaTab/variables";
import * as atActions from "../../../../vendors/AlphaTab/actions";
import ptVars from "../../../../vendors/ML5/PitchDetection/variables";
import { userGetsFeedback } from "../../../../App/musicAssistantApi";
import { sheetMusicError } from "../../../../vendors/Firebase/logs";

// Image imports
import playButtonImg from "../../../../assets/icons/play-icon-fa.svg";
import pauseButtonImg from "../../../../assets/icons/pause-icon-fa.svg";
import stopButtonImg from "../../../../assets/icons/stop-icon-fa.svg";

// Style imports
import styles from "./MusicControls.module.scss";

class MusicControls extends Component {
    // Component state
    state = {
        // trackSelectionIsActive: false
        isPlaying: false,
        trackName: "?",
        musicDisplayed: "?",
        generatingExercises: false,
        startMeasure: 1,
        endMeasure: 1,
        measureSelectorOpen: false,
        getsFeedback: false
    };

    // /**
    //  * Switches flag for track selection dropdown menu
    //  * If the menu is not showing, show it; otherwise, hide it
    //  */
    // trackSelectionButtonHandler = () => {
    //     this.setState(prevState => ({
    //         trackSelectionIsActive: !prevState.trackSelectionIsActive
    //     }));
    // };

    trackSelectionButtonHandler = event => {
        if (this.state.isPlaying) {
            this.stopButtonHandler();
        }
        this.setState({ trackName: event.target.value });
        atActions.changePart(event.target.value);
    };

    musicSelectorHandler = event => {
        if (this.state.isPlaying) {
            this.stopButtonHandler();
        }
        this.setState({ musicDisplayed: event.target.value });
        if (event.target.value === "performance") {
            this.setState({
                generatingExercises: true,
                startMeasure: 1,
                endMeasure: 1
            });
        } else {
            this.setState({ generatingExercises: false });
            this.setState({
                measureSelectorOpen: false
            });
        }
        atActions.changeMusic(event.target.value);
    };

    playbackMeasureHandler = () => {
        if (this.state.measureSelectorOpen) {
            setTimeout(() => {
                let playbackMeasures = atActions.getPlaybackRange();
                if (playbackMeasures !== null) {
                    this.setState({
                        startMeasure: playbackMeasures[0],
                        endMeasure: playbackMeasures[1]
                    });
                }
            }, 500);
        }
    };

    measureSelectorHandler = open => {
        if (open) {
            this.setState({ measureSelectorOpen: true });
            document.getElementById("aTS").addEventListener("mouseup", this.playbackMeasureHandler);
        } else {
            document
                .getElementById("aTS")
                .removeEventListener("mouseup", this.playbackMeasureHandler);
            this.setState({
                measureSelectorOpen: false
            });
        }
    };

    generateExerciseHandler = () => {
        if (!this.state.measureSelectorOpen) {
            let playbackMeasures = atActions.getPlaybackRange();
            if (playbackMeasures !== null) {
                this.setState({
                    startMeasure: playbackMeasures[0],
                    endMeasure: playbackMeasures[1]
                });
            }
            this.measureSelectorHandler(true);
        } else {
            this.measureSelectorHandler(false);
        }
    };

    startMeasureHandler = event => {
        let startMeasure = parseInt(event.target.value, 10);
        if (isNaN(startMeasure)) {
            startMeasure = "";
        }
        this.setState({ startMeasure });
    };

    endMeasureHandler = event => {
        let endMeasure = parseInt(event.target.value, 10);
        if (isNaN(endMeasure)) {
            endMeasure = "";
        }
        this.setState({ endMeasure });
    };

    submitMeasuresHandler = event => {
        event.preventDefault();
        let maxMeasureNumber = atVars.texLoaded.measureLengths.length;
        if (
            typeof this.state.startMeasure !== "number" ||
            typeof this.state.endMeasure !== "number" ||
            this.state.startMeasure > this.state.endMeasure ||
            this.state.startMeasure <= 0 ||
            this.state.endMeasure <= 0 ||
            this.state.startMeasure > maxMeasureNumber ||
            this.state.endMeasure > maxMeasureNumber
        ) {
            alert("Please input valid start and end measures.");
        } else {
            atActions.changeMusic("exercise", this.state.startMeasure, this.state.endMeasure);
            this.measureSelectorHandler(false);
            this.setState({ generatingExercises: false });
        }
    };

    /**
     * Plays or pauses the music
     */
    playPauseButtonHandler = () => {
        if (atVars.texLoaded === null) {
            return;
        }
        // Updates state
        this.setState(prevState => ({
            isPlaying: !prevState.isPlaying
        }));

        // AudioContext must be resumed before playing can begin (the first time)
        if (ptVars.audioContext.state !== "running") {
            ptVars.audioContext
                .resume()
                .then(() => {
                    atVars.api.playPause();
                })
                .catch(error => {
                    sheetMusicError(null, error, "[MusicControls/playPauseButtonHandler]");
                });
        } else {
            atVars.api.playPause();
        }
    };

    /**
     * Stops the music
     */
    stopButtonHandler = () => {
        if (atVars.texLoaded === null) {
            return;
        }
        this.donePlaying();

        atVars.api.stop();
        atVars.noteStreamIndex = 0;
        atVars.cumulativeTime = 0;
    };

    componentDidMount() {
        this.checkFeedback();
        const id = window.setInterval(() => {
            if (atVars.api != null) {
                clearInterval(id);
                atVars.api.addPlayerFinished(() => {
                    this.donePlaying();
                });
            }
        }, 2000);
    }

    /**
     * Sets isPlaying to false in state
     */
    donePlaying = () => {
        this.setState({
            isPlaying: false
        });
    };

    checkFeedback() {
        userGetsFeedback({ sheetMusicId: this.props.sheetMusicId })
            .then(response => {
                if (
                    (response.data["gets_feedback"] && !this.state.getsFeedback) ||
                    (!response.data["gets_feedback"] && this.state.getsFeedback)
                ) {
                    this.setState({ getsFeedback: response.data["gets_feedback"] });
                }
            })
            .catch(error => {
                sheetMusicError(
                    error.response.status,
                    error.response.data,
                    "[MusicControls/checkFeedback]"
                );
            });
    }

    /**
     * Renders the MusicControls component
     */
    render() {
        // Update play/pause button based on state
        let playPauseButton = playButtonImg;
        let playPauseButtonAltText = "Play Button";
        if (this.state.isPlaying) {
            playPauseButton = pauseButtonImg;
            playPauseButtonAltText = "Pause Button";
        }

        let generateExerciseAltText = "Generate Exercise";

        let buttons = null;
        if (this.state.generatingExercises) {
            buttons = (
                <button
                    className={[
                        styles.musicControlsButton,
                        styles.musicControlsPlayPauseButton
                    ].join(" ")}
                    type='button'
                    onClick={this.generateExerciseHandler}>
                    <img
                        id='generateExerciseBtn'
                        src={playPauseButton}
                        alt={generateExerciseAltText}
                    />
                </button>
            );
        } else {
            buttons = (
                <div>
                    <button
                        className={[
                            styles.musicControlsButton,
                            styles.musicControlsPlayPauseButton
                        ].join(" ")}
                        type='button'
                        onClick={this.playPauseButtonHandler}>
                        <img src={playPauseButton} alt={playPauseButtonAltText} />
                    </button>

                    <button
                        className={[
                            styles.musicControlsButton,
                            styles.musicControlsStopButton
                        ].join(" ")}
                        type='button'
                        onClick={this.stopButtonHandler}>
                        <img src={stopButtonImg} alt='Stop Button' />
                    </button>

                    <label htmlFor='sheetMusicPart'>Choose a part:</label>

                    <select id='sheetMusicPart' onChange={this.trackSelectionButtonHandler}>
                        <option value='default'>Waiting for sheet music</option>
                    </select>
                </div>
            );
        }
        let exerciseSelector = null;
        if (this.state.measureSelectorOpen) {
            exerciseSelector = (
                <form onSubmit={this.submitMeasuresHandler}>
                    <label>
                        Start measure:
                        <input
                            type='number'
                            placeholder='Enter Start Measure'
                            value={this.state.startMeasure}
                            onChange={this.startMeasureHandler}
                        />
                    </label>
                    <br />
                    <label>
                        End measure:
                        <input
                            type='number'
                            placeholder='Enter End Measure'
                            value={this.state.endMeasure}
                            onChange={this.endMeasureHandler}
                        />
                    </label>

                    <input type='submit' value='Submit' />
                </form>
            );
        }

        let feedbackMessage = null;
        let performanceButton = null;
        if (this.state.getsFeedback) {
            performanceButton = <option value='performance'>Performance</option>;
        } else {
            feedbackMessage = <p>No feedback</p>;
        }

        // let trackSelectionDropdownMenu = null;
        // if (this.state.trackSelectionIsActive) {
        //     trackSelectionDropdownMenu = (
        //         <TrackSelectionDropdownMenu
        //             trackList={this.props.trackList}
        //             trackListSelectionChanged={this.props.trackListSelectionChanged}
        //         />
        //     );
        // }

        // Returns the JSX to display
        return (
            <section className={styles.musicControls}>
                {buttons}
                {/* <button
                    className={[
                        styles.musicControlsButton,
                        styles.musicControlsPlayPauseButton
                    ].join(" ")}
                    type='button'
                    onClick={this.playPauseButtonHandler}>
                    <img src={playPauseButton} alt={playPauseButtonAltText} />
                </button>

                <button
                    className={[styles.musicControlsButton, styles.musicControlsStopButton].join(
                        " "
                    )}
                    type='button'
                    onClick={this.stopButtonHandler}>
                    <img src={stopButtonImg} alt='Stop Button' />
                </button>

                <button
                    className={[
                        styles.musicControlsButton,
                        styles.musicControlsPlayPauseButton
                    ].join(" ")}
                    type='button'
                    onClick={this.generateExerciseHandler}>
                    <img id="generateExerciseBtn" src={playPauseButton} alt={generateExerciseAltText} />
                </button> */}

                <label htmlFor='texToDisplay'>Choose music:</label>
                <select id='texToDisplay' onChange={this.musicSelectorHandler}>
                    <option value='sheetMusic'>Sheet Music</option>
                    <option value='myPart'>Just My Part</option>
                    {performanceButton}
                </select>

                {/* <div id="list1" className="dropdown-check-list" tabIndex="100">
                    <span className="anchor">Track Not Muted:</span>
                    <ul id="volumeTracks" className="items">
                    </ul>
                </div> */}
                {/* <span className={styles.musicControlsDivider}></span>

                <button
                    className={styles.musicControlsTrackSelector}
                    onClick={this.trackSelectionButtonHandler}>
                    <div className={styles.musicControlsTrackSelectorContainer}>
                        <h3 className={styles.musicControlsTrackSelectorTitle}>Select Tracks</h3>
                        <img
                            className={styles.musicControlsTrackSelectorArrow}
                            src={downArrow}
                            alt='Down Arrow'
                        />
                    </div>
                </button> */}

                {/* {trackSelectionDropdownMenu} */}

                {/* <div className="form-popup" id="myForm">
                    <form action="/action_page.php" className="form-container">
                        <label htmlFor="startMeasure"><b>Start measure</b></label>
                        <input type="number" placeholder="Enter Start Measure" name="startMeasure" required></input>

                        <label htmlFor="endMeasure"><b>End measure</b></label>
                        <input type="number" placeholder="Enter End Measure" name="endMeasure" required></input>

                        <button type="submit" className="btn">Generate</button>
                        <button type="button" className="btn cancel" onClick={this.generateExerciseHandler()}>Close</button>
                    </form>
                </div> */}

                {exerciseSelector}

                {feedbackMessage}
            </section>
        );
    }
}

// Prop types for the MusicControls component
MusicControls.propTypes = {
    sheetMusicId: PropTypes.string.isRequired
};

/**
 * Gets the current state from Redux and passes it to the MusicControls component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        sheetMusicId: state.practice.selectedSheetMusicId
    };
};

export default connect(mapStateToProps)(MusicControls);
