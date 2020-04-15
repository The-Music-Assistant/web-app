// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";

// File imports
import * as buttonTypes from "../../Buttons/buttonTypes";
import * as rectButtonBgColors from "../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as cardColorOptions from "./musicCardColorOptions";

// Style imports
import styles from "./MusicCard.module.scss";

/**
 * Renders the MusicCard component
 * @component
 * @category MusicSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MusicCard = (props) => {
    // Returns the JSX to render
    return (
        <div className={`${styles.musicCard} ${styles[props.cardColor]}`}>
            {/* Music title */}
            <h1 className={styles.musicCardName}>{props.title}</h1>

            {/* Composers */}
            <h2 className={styles.musicCardComposers}>{props.composers}</h2>

            {/* Division line */}
            <span className={styles.musicCardDivisionLine}></span>

            {/* Options */}
            <div className={styles.musicCardButtons}>
                {/* View song button */}
                <RectangularButton
                    backgroundColor={rectButtonBgColors.WHITE}
                    type={buttonTypes.BUTTON}
                    value="view-song"
                    text="View Song"
                    onClick={props.onViewSongClick}
                />

                {/* View performance button */}
                <RectangularButton
                    backgroundColor={rectButtonBgColors.WHITE}
                    type={buttonTypes.BUTTON}
                    value="view-performance"
                    text="View Performance"
                    onClick={props.onViewPerformanceClick}
                />
            </div>
        </div>
    );
};

// Prop types for the MusicCard component
MusicCard.propTypes = {
    /**
     * The title of the music
     */
    title: PropTypes.string.isRequired,

    /**
     * A string containing all composer(s)
     */
    composers: PropTypes.string.isRequired,

    /**
     * The background color of the card.
     * See [options]{@link module:musicCardColorOptions}.
     */
    cardColor: PropTypes.oneOf(Object.values(cardColorOptions)).isRequired,

    /**
     * Click handler for viewing (i.e. practicing) the song
     */
    onViewSongClick: PropTypes.func.isRequired,

    /**
     * Click handler for viewing the performance for the selected song
     */
    onViewPerformanceClick: PropTypes.func.isRequired,
};

export default MusicCard;
