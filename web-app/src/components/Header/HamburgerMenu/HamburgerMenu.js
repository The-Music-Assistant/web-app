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

const HamburgerMenu = props => {
    // Returns the JSX to display
    return (
        <button className={styles.hamburgerMenu} onClick={props.handleClick}>
            <div className={styles.hamburgerMenuBar}></div>
            <div className={styles.hamburgerMenuBar}></div>
            <div className={styles.hamburgerMenuBar}></div>
        </button>
    );
};

// HamburgerMenu prop types
HamburgerMenu.propTypes = {
    handleClick: PropTypes.func.isRequired
}

export default HamburgerMenu;
