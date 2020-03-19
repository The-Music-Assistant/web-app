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

const PageHeader = props => {
    // JSX to display
    return (
        <div className={styles.pageHeader}>
            {props.shouldDisplayBackButton ? (
                <BackButton
                    value='back'
                    text={props.backButtonTitle}
                    onClick={props.backButtonClickedHandler}
                />
            ) : <div></div>}
            <h1 className={styles.pageHeaderHeading}>{props.heading}</h1>
        </div>
    );
};

// PageHeader component prop types
PageHeader.propTypes = {
    heading: PropTypes.string.isRequired,
    shouldDisplayBackButton: PropTypes.bool.isRequired,
    backButtonTitle: PropTypes.string,
    backButtonClickedHandler: PropTypes.func
};

export default PageHeader;
