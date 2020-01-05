// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/MusicControls/MusicControls.js
// Description: Renders the music controls component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/24/2019
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import styles from "./MusicControls.module.scss";
import playButton from "../../../../assets/icons/play-icon-fa.svg";
import pauseButton from "../../../../assets/icons/pause-icon-fa.svg";
import stopButton from "../../../../assets/icons/stop-icon-fa.svg";
import AlphaTabRunner from "../../PracticeSheetMusic/AlphaTabRunner";
import PitchDetection from "../../PracticeSheetMusic/PitchDetection";

class MusicControls extends Component {
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
        // Updates state
        this.donePlaying();

        AlphaTabRunner.api.stop();
        AlphaTabRunner.noteStreamIndex = 0;
        AlphaTabRunner.cumulativeTime = 0;
    }

    componentDidMount() {
        const id = window.setInterval(() => {
            if (AlphaTabRunner.api != null) {
                clearInterval(id);
                AlphaTabRunner.api.addPlayerFinished(() => {
                    this.donePlaying();
                });
            }
        }, 2000)
    }

    /**
     * Sets isPlaying to false in state
     */
    donePlaying = () => {
        this.setState({
            isPlaying: false
        });
    }

    render() {
        // Update play/pause button based on state
        let playPauseButton = playButton;
        let playPauseButtonAltText = "Play Button";

        if (this.state.isPlaying) {
            playPauseButton = pauseButton;
            playPauseButtonAltText = "Pause Button";
        }

        // let trackSelectionDropdownMenu = null;
        // if (this.state.trackSelectionIsActive) {
        //     trackSelectionDropdownMenu = (
        //         <TrackSelectionDropdownMenu trackList={this.props.trackList} trackListSelectionChanged={this.props.trackListSelectionChanged} />
        //     );
        // }

        return (
            <section className={styles.musicControls}>
                <button
                    className={[styles.musicControlsButton, styles.musicControlsPlayPauseButton].join(" ")}
                    type='button'
                    onClick={this.playPauseButtonHandler}>
                    <img src={playPauseButton} alt={playPauseButtonAltText} />
                </button>

                <button
                    className={[styles.musicControlsButton, styles.musicControlsStopButton].join(" ")}
                    type='button'
                    onClick={this.stopButtonHandler}>
                    <img src={stopButton} alt='Stop Button' />
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
