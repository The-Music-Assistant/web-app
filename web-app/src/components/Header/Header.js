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

/**
 * Renders the Header component.
 * @extends {Component}
 * @component
 * @category Header
 * @author Dan Levy <danlevy124@gmail.com>
 */
class Header extends Component {
    constructor(props) {
        super(props);

        /**
         * Header component state
         * @property {string} timeOfDay - The time of day ("Morning," "Afternoon," or "Evening")
         */
        this.state = {
            timeOfDay: this.getTimeOfDay(),
        };
    }

    /**
     * setInterval ID for updating the time of day
     * @type {number}
     */
    _timeOfDayIntervalId = null;

    /**
     * Starts a time of day interval timer
     */
    componentDidMount() {
        this._timeOfDayIntervalId = setInterval(this.updateTimeOfDay, 300000);
    }

    /**
     * Clears the time of day interval timer
     */
    componentWillUnmount() {
        clearInterval(this._timeOfDayIntervalId, this.updateTimeOfDay);
    }

    /**
     * Updates state with the time of day
     * @function
     */
    updateTimeOfDay = () => {
        this.setState({ timeOfDay: this.getTimeOfDay() });
    };

    /**
     * Gets the time of day.
     * Values are "Morning," "Afternoon," or "Evening".
     * @returns {string} The time of day
     */
    getTimeOfDay = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 3 && currentHour < 12) {
            return "Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    };

    /**
     * Gets a hamburger menu if needed
     * @function
     * @returns A hamburger menu (JSX) or null
     */
    getHamburgerMenu = () => {
        return this.props.isMobileScreenWidth ? (
            <HamburgerMenu onClick={this.props.hamburgerMenuClicked} />
        ) : null;
    };

    /**
     * Gets a heading element if needed
     * @function
     * @returns A heading element (JSX) or null
     */
    getHeading = () => {
        return !this.props.isMobileScreenWidth ? (
            <h1
                className={styles.headerHeading}
            >{`Good ${this.state.timeOfDay}`}</h1>
        ) : null;
    };

    /**
     * Gets the TMA logo if needed
     * @function
     * @returns An image element (JSX) or null
     */
    getLogo = () => {
        return this.props.isMobileScreenWidth ? (
            <img
                className={styles.headerLogo}
                src={tmaLogo}
                alt={"The Music Assistant Logo"}
            />
        ) : null;
    };

    /**
     * Renders the Header component
     */
    render() {
        return (
            <header className={styles.header}>
                {this.getHamburgerMenu()}
                {this.getHeading()}
                {this.getLogo()}
                <UserWidget name={this.state.name} />
            </header>
        );
    }
}

// Prop types for the Header component
Header.propTypes = {
    /**
     * Indicates if the screen width is mobile
     */
    isMobileScreenWidth: PropTypes.bool.isRequired,

    /**
     * Hamburger menu icon click handler
     */
    hamburgerMenuClicked: PropTypes.func,
};

export default Header;
