/* ----------------------------------------------------------------------------
// File Path: src/components/Header/Header.js
// Description: Renders the header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
---------------------------------------------------------------------------- */

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// Component imports
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import UserWidget from "./UserWidget/UserWidget";

// Image imports
import tmaLogo from "../../assets/logos/tma-logo-white.png";

// Style imports
import styles from "./Header.module.scss";

class Header extends Component {
    // Component state
    state = {
        profilePic: null,
        name: "Dan Levy",
        timeOfDay: null,
    };

    componentDidMount() {
        this.getTimeOfDay();
    }

    /**
     * Gets the time of day
     * Updates state with time
     * Values are "Morning," "Afternoon," or "Evening"
     */
    getTimeOfDay = () => {
        const currentHour = new Date().getHours();
        let timeOfDay;
        if (currentHour >= 3 && currentHour < 12) {
            timeOfDay = "Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            timeOfDay = "Afternoon";
        } else {
            timeOfDay = "Evening";
        }

        this.setState({ timeOfDay });
    };

    // Returns JSX to render
    render() {
        let hamburgerMenu = null;
        let heading = null;
        let logo = null;
        if (this.props.isMobileScreenSize) {
            hamburgerMenu = <HamburgerMenu handleClick={this.props.hamburgerMenuClicked} />;
            logo = (
                <img className={styles.headerLogo} src={tmaLogo} alt={"The Music Assistant Logo"} />
            );
        } else {
            heading = <h1 className={styles.headerHeading}>{`Good ${this.state.timeOfDay}`}</h1>;
        }

        return (
            <header className={styles.header}>
                {hamburgerMenu}
                {heading}
                {logo}
                <UserWidget profilePic={this.state.profilePic} name={this.state.name} />
            </header>
        );
    }
}

// Header prop types
Header.propTypes = {
    isMobileScreenSize: PropTypes.bool.isRequired,
    hamburgerMenuClicked: PropTypes.func,
};

export default Header;
