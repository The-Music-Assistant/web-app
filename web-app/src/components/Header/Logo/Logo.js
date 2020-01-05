// ----------------------------------------------------------------------------
// File Path: src/components/Header/Logo/Logo.js
// Description: Renders the logo component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

import React from "react";
import musicAssistantLogo from "../../../assets/logos/music-assistant-logo.png";
import styles from "./Logo.module.scss";

const Logo = props => {
    let name = null;
    if (!props.isMobile) {
        name = <h1 className={styles.logoName}>The Music Assistant</h1>
    }

    return (
        <div className={styles.logo}>
            <img className={styles.logoImg} src={musicAssistantLogo} alt='Logo' />
            {name}
        </div>
    );
};

export default Logo;