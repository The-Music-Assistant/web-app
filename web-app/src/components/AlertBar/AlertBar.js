// NPM module imports
import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

// File imports
import * as alertBarTypes from "./alertBarTypes";
import * as transitionOptions from "./alertBarTransitionOptions";

// Image imports
import closeIconWhite from "../../assets/icons/close-icon-white.svg";

// Style imports
import styles from "./AlertBar.module.scss";
import typeStyles from "./AlertBarTypes.module.scss";

/**
 * Renders the AlertBar component.
 * This component is an alert that dismisses itself.
 * @component
 * @category AlertBar
 * @author Dan Levy <danlevy124@gmail.com>
 */
const AlertBar = ({ done, type, heading, message }) => {
    /**
     * The current CSS transition
     * {[currentTransition, setCurrentTransition]: [module:alertBarTransitionOptions, function]}
     */
    const [currentTransition, setCurrentTransition] = useState(null);

    /**
     * The amount of time that the AlertBar component is displayed (no including transition time).
     * Time is in ms.
     * @type {number}
     */
    const DISPLAY_TIME_MS = 5000;

    /**
     * The amount of time that the AlertBar component takes to transition.
     * Time is in ms.
     * If this constant is changed, be sure to change the equivalent time in the SCSS file for this component.
     * @type {number}
     */
    const TRANSITION_TIME_MS = 1000;

    /**
     * Timeout ids for all of the AlertBar positions/transitions
     * @type {object}
     */
    let transitionTimeoutIds = useRef({});

    /**
     * Creates timeouts for AlertBar positions/transitions
     */
    const createComponentTimeouts = useCallback(() => {
        // Timeout that waits to slide the AlertBar down
        // Fixes bug (assuming React bug) where transition down is instant rather than animated
        const waitToSlideDownTimerId = setTimeout(() => {
            delete transitionTimeoutIds.current[waitToSlideDownTimerId];
            setCurrentTransition(transitionOptions.DOWN);
        }, 10);
        transitionTimeoutIds.current.waitToSlideDownTimerId = waitToSlideDownTimerId;

        // Timeout that waits to slide the AlertBar back up
        const waitToSlideUpTimerId = setTimeout(() => {
            delete transitionTimeoutIds.current[waitToSlideUpTimerId];
            setCurrentTransition(transitionOptions.UP);
        }, TRANSITION_TIME_MS + DISPLAY_TIME_MS);
        transitionTimeoutIds.current.waitToSlideUpTimerId = waitToSlideUpTimerId;

        // Timeout that waits to call done (remove the component from the DOM)
        const waitToFinishTimerId = setTimeout(() => {
            delete transitionTimeoutIds.current[waitToFinishTimerId];
            done();
        }, TRANSITION_TIME_MS * 2 + DISPLAY_TIME_MS);
        transitionTimeoutIds.current.waitToFinishTimerId = waitToFinishTimerId;
    }, [done]);

    /**
     * Clears all timeouts for AlertBar positions/transitions
     */
    const clearComponentTimeouts = useCallback(() => {
        for (const timout in transitionTimeoutIds.current) {
            clearTimeout(transitionTimeoutIds.current[timout]);
        }

        // Clears the transitionTimeoutIds object
        transitionTimeoutIds.current = {};
    }, []);

    /**
     * Starts AlertBar component timeouts
     * @returns {function} Stops asynchronous tasks
     */
    useEffect(() => {
        createComponentTimeouts();

        return () => {
            clearComponentTimeouts();
        };
    }, [createComponentTimeouts, clearComponentTimeouts]);

    /**
     * Slides the AlertBar up before the display time has passed
     */
    const closeButttonClickedHandler = () => {
        // Clears the necessary timouts in order to override the slide up
        if (transitionTimeoutIds.current.waitToSlideUpTimerId) {
            clearTimeout(transitionTimeoutIds.current.slideUpTimerId);
        }
        if (transitionTimeoutIds.current.waitToFinishTimerId) {
            clearTimeout(transitionTimeoutIds.current.isDoneTimerId);
        }

        // Tells state to to have the AlertBar slide up
        setCurrentTransition(transitionOptions.UP);

        // Timeout that waits to call done (remove the component from the DOM)
        const waitToFinishOverrideTimerId = setTimeout(() => {
            done();
        }, TRANSITION_TIME_MS);
        transitionTimeoutIds.current.waitToFinishOverrideTimerId = waitToFinishOverrideTimerId;
    };

    /**
     * Gets the CSS background color class name
     * @returns {string} The background color class name
     */
    const getBackgroundColorStyle = () => {
        switch (type) {
            case alertBarTypes.SUCCESS:
                return typeStyles.success;
            case alertBarTypes.WARNING:
                return typeStyles.warning;
            case alertBarTypes.ERROR:
                return typeStyles.error;
            case alertBarTypes.INFO:
                return typeStyles.info;
            default:
                console.error("Invalid alert bar type");
        }
    };

    /**
     * Gets the CSS current transition class name
     * @returns {string} The transition class name
     */
    const getTransitionStyle = () => {
        switch (currentTransition) {
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
     */
    return (
        <section
            className={`${
                styles.alertBar
            } ${getBackgroundColorStyle()} ${getTransitionStyle()}`}
        >
            {/* Alert bar header */}
            <header className={styles.alertBarHeader}>
                <h1 className={styles.alertBarHeaderHeading}>{heading}</h1>

                <button
                    className={styles.alertBarHeaderCloseButton}
                    onClick={closeButttonClickedHandler}
                    type="button"
                >
                    <img
                        className={styles.alertBarHeaderCloseButtonImg}
                        src={closeIconWhite}
                        alt="Close Alert"
                    />
                </button>
            </header>

            <h2 className={styles.alertBarMessage}>{message}</h2>
        </section>
    );
};

// Prop types for the AlertBar component
AlertBar.propTypes = {
    /**
     * The type of AlertBar to display (determines the color).
     * See [types]{@link module:alertBarTypes}.
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
     * Tells the parent component that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,
};

export default AlertBar;
