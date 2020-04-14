// NPM module imports
import React, { Component } from "react";

// File imports
import alphaTabVars from "../../../../vendors/AlphaTab/variables";
import { stopPlayingMusic } from "../../../../vendors/AlphaTab/actions";
import pitchDetectionVars from "../../../../vendors/ML5/PitchDetection/variables";
import { isPitchDetectionAvailable } from "../../../../vendors/ML5/PitchDetection/actions";
import { sheetMusicError } from "../../../../vendors/Firebase/logs";

// Image imports
import playButtonImg from "../../../../assets/icons/play-icon-blue.svg";
import pauseButtonImg from "../../../../assets/icons/pause-icon-blue.svg";
import stopButtonImg from "../../../../assets/icons/stop-icon-blue.svg";

// Style imports
import styles from "./MusicControls.module.scss";

/**
 * Renders the MusicControls component.
 * Handles the play, pause, and stop controls for the sheet music.
 * @extends {Component}
 * @component
 * @category Music
 * @author Dan Levy <danlevy124@gmail.com>
 */
class MusicControls extends Component {
    /**
     * MusicControls component state
     * @property {boolean} isPlaying - Indicates if the music is currently playing
     */
    state = {
        isPlaying: false,
    };

    /**
     * Adds an AlphaTab player finished observer
     */
    componentDidMount() {
        alphaTabVars.api.addPlayerFinished(this.donePlaying);
    }

    /**
     * Removes the AlphaTab player finished observer
     */
    componentWillUnmount() {
        alphaTabVars.api.removePlayerFinished(this.donePlaying);
    }

    /**
     * Plays or pauses the music
     * @function
     */
    playPauseButtonHandler = () => {
        if (alphaTabVars.texLoaded === null) {
            return;
        }

        // Flips the isPlaying property in state
        this.setState((prevState) => ({
            isPlaying: !prevState.isPlaying,
        }));

        // AudioContext must be resumed before playing can begin (the first time)
        if (
            isPitchDetectionAvailable() &&
            pitchDetectionVars.audioContext.state !== "running"
        ) {
            pitchDetectionVars.audioContext
                .resume()
                .then(alphaTabVars.api.playPause)
                .catch((error) => {
                    // Logs an error
                    sheetMusicError(
                        null,
                        error,
                        "[MusicControls/playPauseButtonHandler]"
                    );
                });
        } else {
            alphaTabVars.api.playPause();
        }
    };

    /**
     * Stops the music
     * @function
     */
    stopButtonHandler = () => {
        // Updates state
        this.donePlaying();

        // Tells AlphaTab to stop playing the music
        stopPlayingMusic();
    };

    /**
     * Sets isPlaying to false in state
     * @function
     */
    donePlaying = () => {
        this.setState({
            isPlaying: false,
        });
    };

    /**
     * Gets a play icon or a pause icon
     * @returns An img element (JSX)
     */
    getPlayPauseIcon = () => {
        // Gets play/pause button details based on state
        let imgSrc;
        let altText;
        if (this.state.isPlaying) {
            // Get pause icon
            imgSrc = pauseButtonImg;
            altText = "Pause Button";
        } else {
            // Get play icon
            imgSrc = playButtonImg;
            altText = "Play Button";
        }

        // Returns the image element
        return (
            <img
                className={styles.musicControlsButtonImg}
                src={imgSrc}
                alt={altText}
            />
        );
    };

    /**
     * Renders the MusicControls component
     */
    render() {
        return (
            <div className={styles.musicControls}>
                {/* Play/Pause Button */}
                <button
                    className={styles.musicControlsButton}
                    type="button"
                    onClick={this.playPauseButtonHandler}
                >
                    {this.getPlayPauseButtonImgElement()}
                </button>

                {/* Stop Button */}
                <button
                    className={styles.musicControlsButton}
                    type="button"
                    onClick={this.stopButtonHandler}
                >
                    <img
                        className={styles.musicControlsButtonImg}
                        src={stopButtonImg}
                        alt="Stop Button"
                    />
                </button>
            </div>
        );
    }
}

export default MusicControls;
