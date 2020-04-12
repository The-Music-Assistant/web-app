// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MetroSpinner } from "react-spinners-kit";

// File imports
import { startupDone } from "../../store/actions";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";

// Style imports
import styles from "./Startup.module.scss";

/**
 * Renders the Startup component.
 * This component displays when the app is starting up (i.e. getting auth data).
 * @extends {Component}
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class Startup extends Component {
    /**
     * Startup component state
     * @property {number} windowInnerHeight - The inner height of the window (used to resize the component)
     */
    state = {
        windowInnerHeight: window.innerHeight,
    };

    /**
     * Tells Redux when app startup is done
     */
    componentDidUpdate() {
        if (this.props.isAuthenticated !== null) {
            // Startup is considered done when isAuthenticated is true or false
            this.props.startupDone();
        }
    }

    /**
     * Renders the Startup component
     * @returns {object} The JSX to render
     */
    render() {
        return (
            <div
                className={styles.startup}
                style={{ minHeight: `${this.state.windowInnerHeight}px` }}
            >
                <div>
                    <img
                        className={styles.startupLogo}
                        src={logo}
                        alt="The Music Assistant Logo"
                    />
                    <h1 className={styles.startupHeading}>
                        The Music Assistant
                    </h1>
                    <h2 className={styles.startupSubheading}>
                        Just a moment...
                    </h2>
                    <div className={styles.startupSpinner}>
                        <MetroSpinner
                            size={75}
                            color="#F8F8F8"
                            loading={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// Prop types for the Startup component
Startup.propTypes = {
    /**
     * Indicates if there is an authenticated user
     */
    isAuthenticated: PropTypes.bool,

    /**
     * Indicates if the app startup is done
     */
    startupDone: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the Startup component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Startup
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the Startup component
 */
const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

/**
 * Passes certain Redux actions to the Startup component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Startup
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the Startup component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        startupDone: () => dispatch(startupDone()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
