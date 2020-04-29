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
import colorStyles from "./RectangularButtonColors.module.scss";

/**
 * Renders the RectangularButton component
 * @component
 * @category Buttons
 * @author Dan Levy <danlevy124@gmail.com>
 */
const RectangularButton = (props) => {
    // Returns the JSX to render
    return (
        <ButtonContainer
            className={`${styles.rectButton} ${
                colorStyles[props.backgroundColor]
            }`}
            type={props.type}
            value={props.value}
            onClick={props.onClick}
        >
            {props.title}
        </ButtonContainer>
    );
};

// Prop types for the RectangularButton component
RectangularButton.propTypes = {
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
     * The button's title
     */
    title: PropTypes.string.isRequired,

    /**
     * The button's background color.
     * See [options]{@link module:rectangularButtonColorOptions}.
     */
    backgroundColor: PropTypes.oneOf(Object.values(rectButtonColors)),

    /**
     * Button click handler
     */
    onClick: PropTypes.func,
};

export default RectangularButton;
