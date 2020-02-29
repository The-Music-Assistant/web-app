// ----------------------------------------------------------------------------
// File Path: src/components/Progress/Progress.js
// Description: Renders the progress component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/29/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";

// Image imports
import underConstruction from "../../assets/images/under-construction-hero.png";

// Style imports
import styles from "./Progress.module.scss";

const Progress = () => {
    return (
        <div className={styles.progress}>
            <img
                className={styles.progressHeroImg}
                src={underConstruction}
                alt='Under Construction'
            />
            <h1 className={styles.progressText}>
                This page is currently under construction.
                <br />
                Please check back soon!
            </h1>
        </div>
    );
};

export default Progress;
