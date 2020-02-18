// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/MusicControls/MusicControls.js
// Description: Renders the music controls component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/24/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";

// File imports
import AlphaTabRunner from "../../PracticeSheetMusic/AlphaTabRunner";
import PitchDetection from "../../PracticeSheetMusic/PitchDetection";

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
        isPlaying: false
    };

    /**
     * Switches flag for track selection dropdown menu
     * If the menu is not showing, show it; otherwise, hide it
     */
    trackSelectionButtonHandler = () => {
        this.setState(prevState => ({
            trackSelectionIsActive: !prevState.trackSelectionIsActive
        }));
    };

    /**
     * Plays or pauses the music
     */
    playPauseButtonHandler = () => {
        if (!AlphaTabRunner.texLoaded) {
            return;
        }
        // Updates state
        this.setState(prevState => ({
            isPlaying: !prevState.isPlaying
        }));

        // AudioContext must be resumed before playing can begin (the first time)
        if (PitchDetection.audioContext.state !== "running") {
            PitchDetection.audioContext
                .resume()
                .then(() => {
                    AlphaTabRunner.api.playPause();
                })
                .catch(err => {
                    console.log(`[error][MusicContainer] ${err}`);
                });
        } else {
            AlphaTabRunner.api.playPause();
        }
    };

    /**
     * Stops the music
     */
    stopButtonHandler = () => {
        if (!AlphaTabRunner.texLoaded) {
            return;
        }
        this.donePlaying();

        AlphaTabRunner.api.stop();
        AlphaTabRunner.noteStreamIndex = 0;
        AlphaTabRunner.cumulativeTime = 0;
    };

    /**
     * TODO: Figure out what this does
     */
    componentDidMount() {
        const id = window.setInterval(() => {
            if (AlphaTabRunner.api != null) {
                clearInterval(id);
                AlphaTabRunner.api.addPlayerFinished(() => {
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
                    className={[styles.musicControlsButton, styles.musicControlsStopButton].join(
                        " "
                    )}
                    type='button'
                    onClick={this.stopButtonHandler}>
                    <img src={stopButtonImg} alt='Stop Button' />
                </button>

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
            </section>
        );
    }
}

export default MusicControls;
