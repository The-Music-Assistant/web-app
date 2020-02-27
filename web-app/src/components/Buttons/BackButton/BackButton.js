// ----------------------------------------------------------------------------
// File Path: src/components/Buttons/BackButton/BackButton.js
// Description: Renders the back button component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/27/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Image imports
import leftArrowBlue from "../../../assets/icons/left-arrow-blue-fa.svg";

// Style imports
import styles from "./BackButton.module.scss";

const BackButton = props => {
    // Returns the JSX to render
    return (
        <button
            className={styles.backButton}
            type='button'
            value={props.value}
            onClick={props.onClick}>
            <img className={styles.backButtonArrow} src={leftArrowBlue} alt='Back Button' />
            <span className={styles.backButtonText}>{props.text}</span>
        </button>
    );
};

// BackButton prop types
BackButton.propTypes = {
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default BackButton;
