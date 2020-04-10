// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import ButtonContainer from "../ButtonContainer/ButtonContainer";

// File imports
import * as textButtonColors from "./textButtonColors";
import * as buttonTypes from "../buttonTypes";

// Style imports
import styles from "./TextButton.module.scss";

/**
 * Renders the TextButton component
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
const TextButton = (props) => {
    // Returns the JSX to render
    return (
        <ButtonContainer
            className={`${styles.textButton} ${styles[`${props.textColor}TextButton`]}`}
            type={props.type}
            value={props.value}
            onClick={props.onClick}>
            {props.text}
        </ButtonContainer>
    );
};

// Prop types for the TextButton component
TextButton.propTypes = {
    /**
     * The button's type (HTML type).
     * See {@link module:buttonTypes}.
     */
    type: PropTypes.oneOf([buttonTypes.BUTTON, buttonTypes.RESET, buttonTypes.SUBMIT]).isRequired,

    /**
     * The button's value (HTML value)
     */
    value: PropTypes.string.isRequired,

    /**
     * The text to display in the button
     */
    text: PropTypes.string.isRequired,

    /**
     * The button's text color.
     * See {@link module:textButtonColors}.
     */
    textColor: PropTypes.oneOf([textButtonColors.BLUE, textButtonColors.RED]).isRequired,

    /**
     * Button click handler
     */
    onClick: PropTypes.func,
};

export default TextButton;
