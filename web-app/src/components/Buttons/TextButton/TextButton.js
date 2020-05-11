// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component Imports
import ButtonContainer from "../ButtonContainer/ButtonContainer";

// File imports
import * as textButtonColors from "./textButtonColorOptions";
import * as buttonTypes from "../buttonTypes";

// Style imports
import styles from "./TextButton.module.scss";
import colorStyles from "./TextButtonColors.module.scss";

/**
 * Renders the TextButton component
 * @component
 * @category Buttons
 * @author Dan Levy <danlevy124@gmail.com>
 */
const TextButton = ({ type, value, text, textColor, onClick }) => {
    // Returns the JSX to render
    return (
        <ButtonContainer
            className={`${styles.textButton} ${colorStyles[textColor]}`}
            type={type}
            value={value}
            onClick={onClick}
        >
            {text}
        </ButtonContainer>
    );
};

// Prop types for the TextButton component
TextButton.propTypes = {
    /**
     * The button's type (HTML type).
     * See [types]{@link module:buttonTypes}.
     */
    type: PropTypes.oneOf(Object.values(buttonTypes)).isRequired,

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
     * See [options]{@link module:textButtonColorOptions}.
     */
    textColor: PropTypes.oneOf(Object.values(textButtonColors)).isRequired,

    /**
     * Button click handler
     */
    onClick: PropTypes.func,
};

export default TextButton;
