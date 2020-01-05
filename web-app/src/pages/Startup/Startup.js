// ----------------------------------------------------------------------------
// File Path: src/pages/Startup/Startup.js
// Description: Renders the startup page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/4/2020
// ----------------------------------------------------------------------------

import React from "react";
import { MetroSpinner } from "react-spinners-kit";
import styles from "./Startup.module.scss";
import logo from "../../assets/logos/music-assistant-logo.png";

const Startup = () => {
    return (
        <div className={styles.startup}>
            <div>
                <img className={styles.startupLogo} src={logo} alt='The Music Assistant Logo' />
                <h1 className={styles.startupHeading}>The Music Assistant</h1>
                <h2 className={styles.startupSubheading}>Just a moment...</h2>
                <div className={styles.startupSpinnerContainer}>
                    <MetroSpinner size={75} color='#FFFFFF' loading={true} />
                </div>
            </div>
        </div>
    );
};

export default Startup;
