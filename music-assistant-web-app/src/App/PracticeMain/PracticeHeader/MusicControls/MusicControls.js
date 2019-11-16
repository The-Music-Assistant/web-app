import React, { Component } from "react";
import "./MusicControls.scss";
import TrackSelectionDropdownMenu from "./TrackSelectionDropdownMenu/TrackSelectionDropdownMenu";
import playButton from "../../../../assets/icons/play-icon-fa.svg";
import pauseButton from "../../../../assets/icons/pause-icon-fa.svg";
import stopButton from "../../../../assets/icons/stop-icon-fa.svg";
import downArrow from "../../../../assets/icons/down-arrow-white-fa.svg";

class MusicControls extends Component {
    state = {
        isPlaying: false,
        trackSelectionIsActive: false
    };

    /**
     * Switches flag for track selection dropdown menu
     * If the menu is not showing, show it; otherwise, hide it
     */
    trackSelectionButtonHandler = () => {
        console.log("CALL");
        this.setState(prevState => ({
            trackSelectionIsActive: !prevState.trackSelectionIsActive
        }));
    }


    render() {
        let playPauseButton = playButton;
        let playPauseButtonAltText = "Play Button";
        let trackSelectionDropdownMenu = null;
        if (this.state.trackSelectionIsActive) {
            trackSelectionDropdownMenu = (
                <TrackSelectionDropdownMenu trackList={this.props.trackList} trackListSelectionChanged={this.props.trackListSelectionChanged} />
            );
        }

        if (this.state.isPlaying) {
            playPauseButton = pauseButton;
            playPauseButtonAltText = "Pause Button";
        }

        return (
            <section id='music-controls'>
                <button
                    id='music-controls-play-pause-button'
                    className='music-controls-button'
                    type='button'>
                    <img src={playPauseButton} alt={playPauseButtonAltText} />
                </button>

                <button
                    id='music-controls-stop-button'
                    className='music-controls-button'
                    type='button'>
                    <img src={stopButton} alt='Stop Button' />
                </button>

                <span id='music-controls-divider'></span>

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
                </button>

                {trackSelectionDropdownMenu}
            </section>
        );
    }
}

export default MusicControls;
