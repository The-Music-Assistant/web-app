// ----------------------------------------------------------------------------
// File Path: src/components/Spinners/LoadingContainer/LoadingContainer.js
// Description: Renders the LoadingContainer component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { MetroSpinner } from "react-spinners-kit";

// Style imports
import styles from "./LoadingContainer.module.scss";

const LoadingContainer = props => {
    // Returns the JSX to display
    return (
        <div className={styles.loadingContainer}>
            <MetroSpinner size={75} color='#5F9CD1' loading={true} />
            <h1 className={styles.loadingContainerMessage}>{props.message}</h1>
        </div>
    );
};

// LoadingContainer prop types
LoadingContainer.propTypes = {
    message: PropTypes.string.isRequired
};

export default LoadingContainer;
