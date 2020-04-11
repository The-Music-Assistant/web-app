// ----------------------------------------------------------------------------
// File Path: src/components/PageHeader/PageHeader.js
// Description: Renders the PageHeader component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import BackButton from "../Buttons/BackButton/BackButton";

// Style imports
import styles from "./PageHeader.module.scss";

/**
 * Renders the PageHeader component
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const PageHeader = (props) => {
    // Returns the JSX to display
    return (
        <div className={styles.pageHeader}>
            {/* Back button */}
            {props.shouldDisplayBackButton ? (
                <BackButton value='back' text={props.backButtonTitle} />
            ) : (
                <div></div>
            )}

            {/* Heading */}
            <h1 className={styles.pageHeaderHeading}>{props.heading}</h1>
        </div>
    );
};

// Prop types for the PageHeader component
PageHeader.propTypes = {
    /**
     * The page heading
     */
    heading: PropTypes.string.isRequired,

    /**
     * Indicates if a back button should be displayed
     */
    shouldDisplayBackButton: PropTypes.bool.isRequired,

    /**
     * The title of the back button
     */
    backButtonTitle: PropTypes.string,
};

export default PageHeader;
