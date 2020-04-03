// ----------------------------------------------------------------------------
// File Path: src/components/MusicSelection/MusicCard/MusicCard.js
// Description: Renders the music card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/26/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";

// File imports
import * as buttonTypes from "../../Buttons/buttonTypes";
import * as rectButtonBgColors from "../../Buttons/RectangularButton/rectangularButtonColorOptions";

// Style imports
import styles from "./MusicCard.module.scss";

const MusicCard = (props) => {
    return (
        <div className={`${styles.musicCard} ${styles[props.cardColor]}`}>
            <h1 className={styles.musicCardName}>{props.title}</h1>
            <h2 className={styles.musicCardComposers}>{props.composers}</h2>
            <span className={styles.musicCardDivisionLine}></span>
            <div className={styles.musicCardButtons}>
                <RectangularButton
                    backgroundColor={rectButtonBgColors.WHITE}
                    type={buttonTypes.BUTTON}
                    value='view-song'
                    text='View Song'
                    onClick={props.viewSongClicked}
                />
                {props.shouldShowViewPerformancesButton ? (
                    <RectangularButton
                        backgroundColor={rectButtonBgColors.WHITE}
                        type={buttonTypes.BUTTON}
                        value='view-performance'
                        text='View Performance'
                        onClick={props.viewPerformanceClicked}
                    />
                ) : null}
            </div>
        </div>
    );
};

MusicCard.propTypes = {
    title: PropTypes.string.isRequired,
    composers: PropTypes.string.isRequired,
    cardColor: PropTypes.string.isRequired,
    viewSongClicked: PropTypes.func.isRequired,
    viewPerformanceClicked: PropTypes.func.isRequired,
    shouldShowViewPerformancesButton: PropTypes.bool.isRequired,
};

export default MusicCard;
