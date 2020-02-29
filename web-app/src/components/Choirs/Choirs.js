// ----------------------------------------------------------------------------
// File Path: src/components/Choirs/Choirs.js
// Description: Renders the choirs component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/29/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";

// Image imports
import underConstruction from "../../assets/images/under-construction-hero.png";

// Style imports
import styles from "./Choirs.module.scss";

const Choirs = () => {
    return (
        <div className={styles.choirs}>
            <img
                className={styles.choirsHeroImg}
                src={underConstruction}
                alt='Under Construction'
            />
            <h1 className={styles.choirsText}>
                This page is currently under construction.
                <br />
                Please check back soon!
            </h1>
        </div>
    );
};

export default Choirs;
