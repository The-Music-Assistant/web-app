// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// File imports
import * as alertBarTypes from "./alertBarTypes";
import * as transitionOptions from "./transitionOptions";

// Image imports
import closeIconWhite from "../../assets/icons/close-icon-white.svg";

// Style imports
import styles from "./AlertBar.module.scss";

/**
 * Renders the AlertBar component.
 * This component is an alert that dismisses itself.
 * @extends {Component}
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class AlertBar extends Component {
    /**
     * AlertBar component state
     * @property {module:transitionOptions} transition - The current CSS transition
     */
    state = {
        transition: null,
    };

    /**
     * The amount of time that the AlertBar component is displayed (no including transition time).
     * Time is in ms.
     * @type {number}
     */
    _DISPLAY_TIME_MS = 5000;

    /**
     * The amount of time that the AlertBar component takes to transition.
     * Time is in ms.
     * If this constant is changed, be sure to change the equivalent time in the SCSS file for this component.
     * @type {number}
     */
    _TRANSITION_TIME_MS = 1000;

    /**
     * Timeout ids for all of the AlertBar positions/transitions
     * @type {object}
     */
    _transitionTimeoutIds = {};

    /**
     * Starts AlertBar component timeouts
     */
    componentDidMount() {
        this.createComponentTimeouts();
    }

    /**
     * Stops asynchronous tasks
     */
    componentWillUnmount() {
        this.clearComponentTimeouts();
    }

    /**
     * Creates timeouts for AlertBar positions/transitions
     * @function
     */
    createComponentTimeouts = () => {
        // Timeout that waits to slide the AlertBar down
        // Fixes bug (assuming React bug) where transition down is instant rather than animated
        const waitToSlideDownTimerId = setTimeout(() => {
            delete this._transitionTimeoutIds[waitToSlideDownTimerId];
            this.setState({ transition: transitionOptions.DOWN });
        }, 10);
        this._transitionTimeoutIds.waitToSlideDownTimerId = waitToSlideDownTimerId;

        // Timeout that waits to slide the AlertBar back up
        const waitToSlideUpTimerId = setTimeout(() => {
            delete this._transitionTimeoutIds[waitToSlideUpTimerId];
            this.setState({ transition: transitionOptions.UP });
        }, this._TRANSITION_TIME_MS + this._DISPLAY_TIME_MS);
        this._transitionTimeoutIds.waitToSlideUpTimerId = waitToSlideUpTimerId;

        // Timeout that waits to call done (remove the component from the DOM)
        const waitToFinishTimerId = setTimeout(() => {
            delete this._transitionTimeoutIds[waitToFinishTimerId];
            this.props.done();
        }, this._TRANSITION_TIME_MS * 2 + this._DISPLAY_TIME_MS);
        this._transitionTimeoutIds.waitToFinishTimerId = waitToFinishTimerId;
    };

    /**
     * Clears all timeouts for AlertBar positions/transitions
     * @function
     */
    clearComponentTimeouts = () => {
        for (const timout in this._transitionTimeoutIds) {
            clearTimeout(this._transitionTimeoutIds[timout]);
        }

        // Clears the transitionTimeoutIds object
        this._transitionTimeoutIds = {};
    };

    /**
     * Slides the AlertBar up before the display time has passed
     * @function
     */
    closeButttonClickedHandler = () => {
        // Clears the necessary timouts in order to override the slide up
        if (this._transitionTimeoutIds.waitToSlideUpTimerId) {
            clearTimeout(this._transitionTimeoutIds.slideUpTimerId);
        }
        if (this._transitionTimeoutIds.waitToFinishTimerId) {
            clearTimeout(this._transitionTimeoutIds.isDoneTimerId);
        }

        // Tells state to to have the AlertBar slide up
        this.setState({ transition: transitionOptions.UP });

        // Timeout that waits to call done (remove the component from the DOM)
        const waitToFinishOverrideTimerId = setTimeout(() => {
            this.props.done();
        }, this._TRANSITION_TIME_MS);
        this._transitionTimeoutIds.waitToFinishOverrideTimerId = waitToFinishOverrideTimerId;
    };

    /**
     * Gets the CSS background color class name
     * @function
     * @returns {string} The background color class name
     */
    getBackgroundColorStyle = () => {
        switch (this.props.type) {
            case alertBarTypes.SUCCESS:
                return styles.alertBarSuccess;
            case alertBarTypes.WARNING:
                return styles.alertBarWarning;
            case alertBarTypes.ERROR:
                return styles.alertBarError;
            default:
                return styles.alertBarInfo;
        }
    };

    /**
     * Gets the CSS current transition class name
     * @function
     * @returns {string} The transition class name
     */
    getTransitionStyle = () => {
        switch (this.state.transition) {
            case transitionOptions.DOWN:
                return styles.alertBarSlideDown;
            case transitionOptions.UP:
                return styles.alertBarSlideUp;
            default:
                return null;
        }
    };

    /**
     * Renders the AlertBar component
     * @returns {object} The JSX to render
     */
    render() {
        return (
            <div
                className={`${
                    styles.alertBar
                } ${this.getBackgroundColorStyle()} ${this.getTransitionStyle()}`}>
                <div className={styles.alertBarTopGrid}>
                    {/* Empty container div for the left-hand side of the top grid */}
                    <div></div>

                    <h1 className={styles.alertBarHeading}>{this.props.heading}</h1>

                    <button
                        className={styles.alertBarCloseButton}
                        onClick={this.closeButttonClickedHandler}
                        type='button'>
                        <img
                            className={styles.alertBarCloseButtonImg}
                            src={closeIconWhite}
                            alt='Close Alert'
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
    /**
     * The type of AlertBar to display (determines the color).
     * See {@link module:alertBarTypes}.
     */
    type: PropTypes.oneOf([
        alertBarTypes.SUCCESS,
        alertBarTypes.WARNING,
        alertBarTypes.ERROR,
        alertBarTypes.INFO,
    ]).isRequired,

    /**
     * The heading to display
     */
    heading: PropTypes.string.isRequired,

    /**
     * The message to display
     */
    message: PropTypes.string.isRequired,

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,
};

export default AlertBar;
