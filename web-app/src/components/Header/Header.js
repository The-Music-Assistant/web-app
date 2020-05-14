// NPM module imports
import React, { useState, useEffect, useCallback, useRef } from "react";
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
 * @component
 * @category Header
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Header = ({ isMobileScreenWidth, onHamburgerMenuClick }) => {
    /**
     * Gets the time of day.
     * Values are "Morning," "Afternoon," or "Evening".
     * @returns {string} The time of day
     */
    const getTimeOfDay = () => {
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
     * The time of day ("Morning," "Afternoon," or "Evening")
     * {[timeOfDay, setTimeOfDay]: [string, function]}
     */
    const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

    /**
     * setInterval ID for updating the time of day
     * @type {number}
     */
    const timeOfDayIntervalId = useRef(null);

    /**
     * Updates state with the time of day
     */
    const updateTimeOfDay = useCallback(() => {
        setTimeOfDay(getTimeOfDay());
    }, []);

    /**
     * Starts a time of day interval timer
     * @returns {function} A cleanup function that clears the time of day interval timer
     */
    useEffect(() => {
        timeOfDayIntervalId.current = setInterval(updateTimeOfDay, 300000);

        return () => {
            clearInterval(timeOfDayIntervalId.current, updateTimeOfDay);
        };
    }, [updateTimeOfDay]);

    /**
     * Gets a hamburger menu if needed
     * @returns A hamburger menu (JSX) or null
     */
    const getHamburgerMenu = () => {
        return isMobileScreenWidth ? (
            <HamburgerMenu onClick={onHamburgerMenuClick} />
        ) : null;
    };

    /**
     * Gets a heading element if needed
     * @returns A heading element (JSX) or null
     */
    const getHeading = () => {
        return !isMobileScreenWidth ? (
            <h1 className={styles.headerHeading}>{`Good ${timeOfDay}`}</h1>
        ) : null;
    };

    /**
     * Gets the TMA logo if needed
     * @returns An image element (JSX) or null
     */
    const getLogo = () => {
        return isMobileScreenWidth ? (
            <img
                className={styles.headerLogo}
                src={tmaLogo}
                alt={"The Music Assistant Logo"}
            />
        ) : null;
    };

    // Renders the Header componen
    return (
        <header className={styles.header}>
            {getHamburgerMenu()}
            {getHeading()}
            {getLogo()}
            <UserWidget />
        </header>
    );
};

// Prop types for the Header component
Header.propTypes = {
    /**
     * Indicates if the screen width is mobile
     */
    isMobileScreenWidth: PropTypes.bool.isRequired,

    /**
     * Hamburger menu icon click handler
     */
    onHamburgerMenuClick: PropTypes.func,
};

export default Header;
