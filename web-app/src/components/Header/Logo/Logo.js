// ----------------------------------------------------------------------------
// File Path: src/components/Header/Logo/Logo.js
// Description: Renders the logo component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Image imports
import musicAssistantLogo from "../../../assets/logos/music-assistant-logo.png";

// Style imports
import styles from "./Logo.module.scss";

const Logo = props => {
    // Shows "The Music Assistant" if screen is not mobile
    let name = null;
    if (!props.isMobile) {
        name = <h1 className={styles.logoName}>The Music Assistant</h1>;
    }

    // Returns the JSX to render
    return (
        <div className={styles.logo}>
            <img className={styles.logoImg} src={musicAssistantLogo} alt='Logo' />
            {name}
        </div>
    );
};

// Logo prop types
Logo.propTypes = {
    isMobile: PropTypes.bool.isRequired
};

export default Logo;
