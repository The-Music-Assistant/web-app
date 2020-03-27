// ----------------------------------------------------------------------------
// File Path: src/components/AlertBar/AlertBar.js
// Description: Renders the alert bar component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/20/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// File imports
import * as alertBarTypes from "./alertBarTypes";

// Image imports
import closeIconWhite from "../../assets/icons/close-icon-white.svg";

// Style imports
import styles from "./AlertBar.module.scss";

class AlertBar extends Component {
    DISPLAY_TIME_MS = 5000;
    TRANSITION_TIME_MS = 1000;

    // Component state
    // transition indicates the current transition direction (up or down)
    state = {
        transition: null
    };

    // The ids for all of the alert bar animations
    timerIds = {};

    /**
     * Creates timers for alert bar animations
     */
    componentDidMount() {
        // Timer for sliding down
        // Fixes bug (assuming React bug) where transition down is instant rather than animated
        const slideDownTimerId = setTimeout(() => {
            this.setState({ transition: "down" });
        }, 10);

        // Timer for holding in the down position
        const slideUpTimerId = setTimeout(() => {
            this.setState({ transition: "up" });
        }, this.TRANSITION_TIME_MS + this.DISPLAY_TIME_MS);

        // Timer for sliding back up
        const isDoneTimerId = setTimeout(() => {
            this.props.done();
        }, this.TRANSITION_TIME_MS * 2 + this.DISPLAY_TIME_MS);

        // Holds timer ids in state
        this.timerIds = { slideDownTimerId, slideUpTimerId, isDoneTimerId };
    }

    /**
     * Clears all timers
     */
    componentWillUnmount() {
        for (const timerId in this.timerIds) {
            clearTimeout(this.timerIds[timerId]);
        }
    }

    /**
     * Closes the alert bar early
     */
    closeButttonClickedHandler = () => {
        // Clears the necessary timer ids in order to override the slide up
        clearTimeout(this.timerIds.slideUpTimerId);
        clearTimeout(this.timerIds.isDoneTimerId);

        // Alert bar slides up
        this.setState({ transition: "up" });
        setTimeout(() => {
            this.props.done();
        }, this.TRANSITION_TIME_MS);
    };

    /**
     * Renders the AlertBar component
     */
    render() {
        // Sets the background color of the alert bar
        let backgroundColorStyle;
        switch (this.props.type) {
            case alertBarTypes.SUCCESS:
                backgroundColorStyle = styles.alertBarSuccess;
                break;
            case alertBarTypes.WARNING:
                backgroundColorStyle = styles.alertBarWarning;
                break;
            case alertBarTypes.ERROR:
                backgroundColorStyle = styles.alertBarError;
                break;
            default:
                backgroundColorStyle = styles.alertBarInfo;
        }

        // Sets the CSS transition class
        let transitionStyle;
        switch (this.state.transition) {
            case "down":
                transitionStyle = styles.alertBarSlideDown;
                break;
            case "up":
                transitionStyle = styles.alertBarSlideUp;
                break;
            default:
                transitionStyle = null;
        }

        // Returns the JSX to display
        return (
            <div className={[styles.alertBar, backgroundColorStyle, transitionStyle].join(" ")}>
                <div className={styles.alertBarTopGrid}>
                    <div></div>
                    <h1 className={styles.alertBarHeading}>{this.props.heading}</h1>
                    <button
                        className={styles.alertBarCloseButton}
                        onClick={this.closeButttonClickedHandler}
                        type='button'>
                        <img
                            className={styles.alertBarCloseButtonImg}
                            src={closeIconWhite}
                            alt='Close Alert Button'
                        />
                    </button>
                </div>
                <h2 className={styles.alertBarMessage}>{this.props.message}</h2>
            </div>
        );
    }
}

// Prop types for the AlertBar component
AlertBar.propTypes = {
    type: PropTypes.oneOf([
        alertBarTypes.SUCCESS,
        alertBarTypes.WARNING,
        alertBarTypes.ERROR,
        alertBarTypes.INFO
    ]).isRequired,
    heading: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    done: PropTypes.func.isRequired
};

export default AlertBar;
