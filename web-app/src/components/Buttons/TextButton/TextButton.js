// ----------------------------------------------------------------------------
// File Path: src/components/Buttons/TextButton/TextButton.js
// Description: Renders the text button component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/5/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File imports
import * as textButtonColors from "./textButtonColors";
import * as buttonTypes from "../buttonTypes";

// Style imports
import styles from "./TextButton.module.scss";

const TextButton = props => {
    // List of class names to attach to the button
    const classNames = [styles.textButton];
    classNames.push(styles[`${props.textColor}TextButton`]);

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

// TextButton prop types
TextButton.propTypes = {
    textColor: PropTypes.oneOf([textButtonColors.BLUE, textButtonColors.RED]).isRequired,
    type: PropTypes.oneOf([buttonTypes.BUTTON, buttonTypes.RESET, buttonTypes.SUBMIT]).isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default TextButton;
