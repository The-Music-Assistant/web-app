// NPM module imports
import React from "react";

// Image imports
import underConstruction from "../../assets/images/under-construction-hero.png";

// Style imports
import styles from "./Home.module.scss";

/**
 * Renders the Home component
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Home = () => {
    // TODO: Set this component up

    // Returns the JSX to render
    return (
        <div className={styles.home}>
            <img
                className={styles.homeHeroImg}
                src={underConstruction}
                alt="Under Construction"
            />
            <h1 className={styles.homeText}>
                This page is currently under construction.
                <br />
                Please check back soon!
            </h1>
        </div>
    );
};

export default Home;
