// ----------------------------------------------------------------------------
// File Path: src/pages/Startup/Startup.js
// Description: Renders the startup page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/4/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import { MetroSpinner } from "react-spinners-kit";

// Image imports
import logo from "../../assets/logos/music-assistant-logo.png";

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

export default Startup;
