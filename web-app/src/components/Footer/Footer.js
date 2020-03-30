// ----------------------------------------------------------------------------
// File Path: src/components/Footer/Footer.js
// Description: Renders the footer component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";

// Style imports
import styles from "./Footer.module.scss";

const Footer = () => {
    // Returns the JSX to display
    return (
        <footer className={styles.footer}>
            <small className={styles.footerText}>&copy; 2020 The Music Assistant</small>
            <small className={styles.footerText}>Version 0.0.10</small>
        </footer>
    );
};

export default Footer;
