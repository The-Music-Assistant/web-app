// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import ButtonContainer from "../ButtonContainer/ButtonContainer";

// File imports
import * as rectButtonColors from "./rectangularButtonColorOptions";
import * as buttonTypes from "../buttonTypes";

// Style imports
import styles from "./RectangularButton.module.scss";

/**
 * Renders the RectangularButton component
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
const RectangularButton = (props) => {
    // Returns the JSX to render
    return (
        <ButtonContainer
            className={`${styles.rectButton} ${styles[`${props.backgroundColor}RectButton`]}`}
            type={props.type}
            value={props.value}
            onClick={props.onClick}>
            {props.text}
        </ButtonContainer>
    );
};

// Prop types for the RectangularButton component
RectangularButton.propTypes = {
    /**
     * The button's type (HTML type)
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
     * The button's background color
     */
    backgroundColor: PropTypes.oneOf([
        rectButtonColors.WHITE,
        rectButtonColors.BLUE,
        rectButtonColors.GREEN,
        rectButtonColors.ORANGE,
        rectButtonColors.RED,
    ]).isRequired,

    /**
     * Button click handler
     */
    onClick: PropTypes.func,
};

export default RectangularButton;
