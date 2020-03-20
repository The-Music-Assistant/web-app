// ----------------------------------------------------------------------------
// File Path: src/components/Spinners/LoadingHUD/LoadingHUD.js
// Description: Renders the loading HUD component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/18/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { MetroSpinner } from "react-spinners-kit";

// Style imports
import styles from "./LoadingHUD.module.scss";

const LoadingHUD = props => {
    // Returns JSX to display
    return (
        <div className={styles.background}>
            <div className={styles.modal}>
                <MetroSpinner size={50} color='#5f9cd1' loading={true} />
                <h3 className={styles.modalText}>{props.text}</h3>
            </div>
        </div>
    );
};

// Loading HUD prop types
LoadingHUD.propTypes = {
    text: PropTypes.string
};

export default LoadingHUD;
