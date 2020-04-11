// ----------------------------------------------------------------------------
// File Path: src/components/Header/HamburgerMenu/HamburgerMenu.js
// Description: Renders the hamburger menu component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./HamburgerMenu.module.scss";

/**
 * Renders the HamburgerMenu component.
 * NOTE: This component contains just the hamburger menu icon, and not the mobile navigation.
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const HamburgerMenu = (props) => {
    // Returns the JSX to render
    return (
        <button className={styles.hamburgerMenu} onClick={props.onClick}>
            <div className={styles.hamburgerMenuBar}></div>
            <div className={styles.hamburgerMenuBar}></div>
            <div className={styles.hamburgerMenuBar}></div>
        </button>
    );
};

// Prop types for the HamburgerMenu component
HamburgerMenu.propTypes = {
    /**
     * Click handler
     */
    onClick: PropTypes.func.isRequired,
};

export default HamburgerMenu;
