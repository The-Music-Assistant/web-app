// ----------------------------------------------------------------------------
// File Path: src/components/Footer/Footer.js
// Description: Renders the footer component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";

// Image imports
import floridaTechLogo from "../../assets/logos/florida-tech-logo.png";

// Style imports
import styles from "./Footer.module.scss";

const Footer = () => {
    // Returns the JSX to display
    return (
        <footer className={styles.footer}>
            <img className={styles.footerLogo} src={floridaTechLogo} alt='Florida Tech Logo' />
            <small className={styles.footerCopyright}>&copy; 2019 The Music Assistant</small>
        </footer>
    );
};

export default Footer;
