import React from "react";
import "./MusicControls.scss";
import playButton from "../assets/icons/play-icon-fa.svg";
import pauseButton from "../assets/icons/pause-icon-fa.svg";
import stopButton from "../assets/icons/stop-icon-fa.svg";

const MusicControls = props => {
    let playPauseButton = playButton;
    let playPauseButtonAltText = "Play Button";
    if (props.isPaused) {
        playPauseButton = pauseButton;
        playPauseButtonAltText = "Pause Button";
    }

    return (
        <section id="music-controls">
            <button id="music-controls-play-pause-button" className="music-controls-button">
                <img src={playPauseButton} alt={playPauseButtonAltText}/>
            </button>

            <button id="music-controls-stop-button" className="music-controls-button">
                <img src={stopButton} alt="Stop Button" />
            </button>
        </section>
    );
};

export default MusicControls;