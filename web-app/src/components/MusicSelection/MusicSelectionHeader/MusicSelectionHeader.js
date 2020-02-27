// ----------------------------------------------------------------------------
// File Path: src/components/MusicSelection/MusicSelectionHeader/MusicSelectionHeader.js
// Description: Renders the music selection header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/27/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import BackButton from "../../Buttons/BackButton/BackButton";

// Style imports
import styles from "./MusicSelectionHeader.module.scss";

const MusicSelectionHeader = props => {
    return (
        <div className={styles.musicSelectionHeader}>
            <BackButton
                value='choir-selection-back'
                text='Choir Selection'
                onClick={props.backButtonClickedHandler}
            />
            <h1 className={styles.musicSelectionHeaderHeading}>{props.heading}</h1>
        </div>
    );
};

MusicSelectionHeader.propTypes = {
    heading: PropTypes.string.isRequired,
    backButtonClickedHandler: PropTypes.func.isRequired
};

export default MusicSelectionHeader;
