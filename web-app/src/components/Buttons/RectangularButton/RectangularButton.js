// ----------------------------------------------------------------------------
// File Path: src/components/Buttons/RectangularButton/RectangularButton.js
// Description: Renders the rectangular button component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/5/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File imports
import * as rectButtonColors from "./rectangularButtonColorOptions";
import * as buttonTypes from "../buttonTypes";

// Style imports
import styles from "./RectangularButton.module.scss";

const RectangularButton = props => {
    // List of class names to attach to the button
    const classNames = [styles.rectButton];
    classNames.push(styles[`${props.backgroundColor}RectButton`]);

    // Returns JSX to display
    return (
        <button
            className={classNames.join(" ")}
            type={props.type}
            value={props.value}
            onClick={props.onClick}>
            {props.text}
        </button>
    );
};

// RectangularButton prop types
RectangularButton.propTypes = {
    type: PropTypes.oneOf([buttonTypes.BUTTON, buttonTypes.RESET, buttonTypes.SUBMIT]).isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    backgroundColor: PropTypes.oneOf([
        rectButtonColors.WHITE,
        rectButtonColors.BLUE,
        rectButtonColors.GREEN,
        rectButtonColors.ORANGE,
        rectButtonColors.RED
    ]).isRequired,
    onClick: PropTypes.func
};

export default RectangularButton;
