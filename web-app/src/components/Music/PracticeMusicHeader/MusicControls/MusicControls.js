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
import alphaTabVars from "../../../../vendors/AlphaTab/variables";
import pitchDetectionVars from "../../../../vendors/ML5/PitchDetection/variables";
import { sheetMusicError } from "../../../../vendors/Firebase/logs";

// Image imports
import playButtonImg from "../../../../assets/icons/play-icon-blue.svg";
import pauseButtonImg from "../../../../assets/icons/pause-icon-blue.svg";
import stopButtonImg from "../../../../assets/icons/stop-icon-blue.svg";

// Style imports
import styles from "./MusicControls.module.scss";

class MusicControls extends Component {
    // Component state
    state = {
        isPlaying: false
    };

    /**
     * Plays or pauses the music
     */
    playPauseButtonHandler = () => {
        if (alphaTabVars.texLoaded === null) {
            return;
        }
        // Updates state
        this.setState(prevState => ({
            isPlaying: !prevState.isPlaying
        }));

        // AudioContext must be resumed before playing can begin (the first time)
        if (pitchDetectionVars.audioContext.state !== "running") {
            pitchDetectionVars.audioContext
                .resume()
                .then(() => {
                    alphaTabVars.api.playPause();
                })
                .catch(error => {
                    sheetMusicError(null, error, "[MusicControls/playPauseButtonHandler]");
                });
        } else {
            alphaTabVars.api.playPause();
        }
    };

    /**
     * Stops the music
     */
    stopButtonHandler = () => {
        if (alphaTabVars.texLoaded === null) {
            return;
        }
        this.donePlaying();

        alphaTabVars.api.stop();
        alphaTabVars.noteStreamIndex = 0;
        alphaTabVars.cumulativeTime = 0;
    };

    componentDidMount() {
        const id = window.setInterval(() => {
            if (alphaTabVars.api != null) {
                clearInterval(id);
                alphaTabVars.api.addPlayerFinished(() => {
                    this.donePlaying();
                });
            }
        }, 500);
    }

    /**
     * Sets isPlaying to false in state
     */
    donePlaying = () => {
        this.setState({
            isPlaying: false
        });
    };

    /**
     * Renders the MusicControls component
     */
    render() {
        // Gets play/pause button details based on state
        let playPauseButton = playButtonImg;
        let playPauseButtonAltText = "Play Button";
        if (this.state.isPlaying) {
            playPauseButton = pauseButtonImg;
            playPauseButtonAltText = "Pause Button";
        }

        // Returns the JSX to display
        return (
            <div className={styles.musicControls}>
                <button
                    className={styles.musicControlsButton}
                    type='button'
                    onClick={this.playPauseButtonHandler}>
                    <img
                        className={styles.musicControlsButtonImg}
                        src={playPauseButton}
                        alt={playPauseButtonAltText}
                    />
                </button>

                <button
                    className={styles.musicControlsButton}
                    type='button'
                    onClick={this.stopButtonHandler}>
                    <img
                        className={styles.musicControlsButtonImg}
                        src={stopButtonImg}
                        alt='Stop Button'
                    />
                </button>
            </div>
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
