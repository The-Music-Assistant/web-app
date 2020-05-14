// NPM module imports
import React, { useState, useEffect } from "react";

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
 * @component
 * @category Music
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MusicControls = () => {
    /**
     * Indicates if the music is currently playing
     * {[isPlaying, setIsPlaying]: [boolean, function]}
     */
    const [isPlaying, setIsPlaying] = useState(false);

    /**
     * Adds an AlphaTab player finished observer
     * @returns {function} A cleanup function that removes the AlphaTab player finished observer
     */
    useEffect(() => {
        alphaTabVars.api.addPlayerFinished(donePlaying);

        return () => {
            alphaTabVars.api.removePlayerFinished(donePlaying);
        };
    }, []);

    /**
     * Plays or pauses the music
     */
    const playPauseButtonHandler = () => {
        if (alphaTabVars.texLoaded === null) {
            return;
        }

        // Flips the isPlaying property in state
        setIsPlaying((prevState) => !prevState);

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
     */
    const stopButtonHandler = () => {
        // Updates state
        donePlaying();

        // Tells AlphaTab to stop playing the music
        stopPlayingMusic();
    };

    /**
     * Sets isPlaying to false in state
     */
    const donePlaying = () => setIsPlaying(false);

    /**
     * Gets a play icon or a pause icon
     * @returns An img element (JSX)
     */
    const getPlayPauseIcon = () => {
        // Gets play/pause button details based on state
        let imgSrc;
        let altText;

        if (isPlaying) {
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
    return (
        <div className={styles.musicControls}>
            {/* Play/Pause Button */}
            <button
                className={styles.musicControlsButton}
                type="button"
                onClick={playPauseButtonHandler}
            >
                {getPlayPauseIcon()}
            </button>

            {/* Stop Button */}
            <button
                className={styles.musicControlsButton}
                type="button"
                onClick={stopButtonHandler}
            >
                <img
                    className={styles.musicControlsButtonImg}
                    src={stopButtonImg}
                    alt="Stop Button"
                />
            </button>
        </div>
    );
};

export default MusicControls;
