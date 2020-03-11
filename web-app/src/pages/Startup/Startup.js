// ----------------------------------------------------------------------------
// File Path: src/pages/Startup/Startup.js
// Description: Renders the startup page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/4/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { MetroSpinner } from "react-spinners-kit";

// File imports
import { startupDone } from "../../store/actions";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";

// Style imports
import styles from "./Startup.module.scss";

class Startup extends Component {
    // Component state
    state = {
        windowInnerHeight: window.innerHeight
    };

    /**
     * Starts a window resize event listener
     */
    componentDidMount() {
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentDidUpdate() {
        if (this.props.isAuthenticated !== null) {
            this.props.startupDone();
        }
    }

    /**
     * Removes the window resize event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
    }

    /**
     * Updates state based on the window's innerwidth
     */
    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth < 768 });
    };

    /**
     * Renders the Startup component
     */
    render() {
        // Returns the JSX to display
        return (
            <div
                className={styles.startup}
                style={{ minHeight: `${this.state.windowInnerHeight}px` }}>
                <div>
                    <img className={styles.startupLogo} src={logo} alt='The Music Assistant Logo' />
                    <h1 className={styles.startupHeading}>The Music Assistant</h1>
                    <h2 className={styles.startupSubheading}>Just a moment...</h2>
                    <div className={styles.startupSpinner}>
                        <MetroSpinner size={75} color='#FFFFFF' loading={true} />
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Gets the current state from Redux and passes it to the Startup component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

/**
 * Passes certain redux actions to the Startup component
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        startupDone: () => dispatch(startupDone())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Startup);
