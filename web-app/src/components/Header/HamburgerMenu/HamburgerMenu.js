// ----------------------------------------------------------------------------
// File Path: src/components/Header/HamburgerMenu/HamburgerMenu.js
// Description: Renders the hamburger menu component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------


import React from "react";
import styles from "./HamburgerMenu.module.scss";

const HamburgerMenu = props => {
    return (
        <button className={styles.hamburgerMenu} onClick={props.handleClick}>
            <div className={styles.hamburgerMenuBar}></div>
            <div className={styles.hamburgerMenuBar}></div>
            <div className={styles.hamburgerMenuBar}></div>
        </button>
    );
};

export default HamburgerMenu;
