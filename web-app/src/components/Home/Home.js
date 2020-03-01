// ----------------------------------------------------------------------------
// File Path: src/components/Home/Home.js
// Description: Renders the home component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/29/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";

// Image imports
import underConstruction from "../../assets/images/under-construction-hero.png";

// Style imports
import styles from "./Home.module.scss";

const Home = () => {
    return (
        <div className={styles.home}>
            <img className={styles.homeHeroImg} src={underConstruction} alt='Under Construction' />
            <h1 className={styles.homeText}>
                This page is currently under construction.
                <br />
                Please check back soon!
            </h1>
        </div>
    );
};

export default Home;