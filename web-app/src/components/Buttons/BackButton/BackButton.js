// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

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
 * @component
 * @category Buttons
 * @author Dan Levy <danlevy124@gmail.com>
 */
const BackButton = ({ value, title }) => {
    /**
     * react-router-dom history
     * @type {object}
     */
    const history = useHistory();

    /**
     * Tells React Router to go back one page
     */
    const buttonClickedHandler = () => {
        history.goBack();
    };

    // Returns the JSX to render
    return (
        <ButtonContainer
            className={styles.backButton}
            type={buttonTypes.BUTTON}
            value={value}
            onClick={buttonClickedHandler}
        >
            {/* Back button arrow */}
            <img
                className={styles.backButtonArrow}
                src={leftArrowBlue}
                alt="Back Button"
            />

            {/* Back button title */}
            <span className={styles.backButtonTitle}>{title}</span>
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
     * The title of the button
     */
    title: PropTypes.string.isRequired,
};

export default BackButton;
