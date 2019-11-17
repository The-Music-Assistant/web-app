import React, { Component } from "react";
import "./MusicControls.scss";
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
            <section id='music-controls'>
                <button
                    id='music-controls-play-pause-button'
                    className='music-controls-button'
                    type='button'
                    onClick={this.playPauseButtonHandler}>
                    <img src={playPauseButton} alt={playPauseButtonAltText} />
                </button>

                <button
                    id='music-controls-stop-button'
                    className='music-controls-button'
                    type='button'
                    onClick={this.stopButtonHandler}>
                    <img src={stopButton} alt='Stop Button' />
                </button>

                {/* <span id='music-controls-divider'></span>

                <button
                    id='music-controls-track-selector'
                    onClick={this.trackSelectionButtonHandler}>
                    <div id='music-controls-track-selector-container'>
                        <h3 id='music-controls-track-selector-title'>Select Tracks</h3>
                        <img
                            id='music-controls-track-selector-arrow'
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
