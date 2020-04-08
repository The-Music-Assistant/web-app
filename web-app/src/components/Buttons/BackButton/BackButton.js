// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// Component imports
import ButtonContainer from "../ButtonContainer/ButtonContainer";

// File imports
import * as buttonTypes from "../buttonTypes";

// Image imports
import leftArrowBlue from "../../../assets/icons/left-arrow-gray.svg";

// Style imports
import styles from "./BackButton.module.scss";

/**
 * Renders the BackButton component.
 * This button simulates a browser's back button.
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
const BackButton = (props) => {
    /**
     * Tells React Router to go back one page
     */
    const buttonClickedHandler = () => {
        props.history.goBack();
    };

    // Returns the JSX to render
    return (
        <ButtonContainer
            className={styles.backButton}
            type={buttonTypes.BUTTON}
            value={props.value}
            onClick={buttonClickedHandler}>
            <img className={styles.backButtonArrow} src={leftArrowBlue} alt='Back Button' />
            <span className={styles.backButtonText}>{props.text}</span>
        </ButtonContainer>
    );
};

// Prop types for the BackButton component
BackButton.propTypes = {
    /**
     * The button's value (HTML value)
     */
    value: PropTypes.string.isRequired,

    /**
     * The text to display in the button
     */
    text: PropTypes.string.isRequired,
};

export default withRouter(BackButton);
