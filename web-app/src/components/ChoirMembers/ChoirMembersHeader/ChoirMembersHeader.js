// ----------------------------------------------------------------------------
// File Path: src/components/MusicSelection/ChoirMembersHeader/ChoirMembersHeader.js
// Description: Renders the choir members header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/12/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import BackButton from "../../Buttons/BackButton/BackButton";

// Style imports
import styles from "./ChoirMembersHeader.module.scss";

const ChoirMembersHeader = props => {
    return (
        <div className={styles.choirMembersHeader}>
            <BackButton
                value='choir-selection-back'
                text='Choir Selection'
                onClick={props.backButtonClickedHandler}
            />
            <h1 className={styles.choirMembersHeaderHeading}>{props.heading}</h1>
        </div>
    );
};

ChoirMembersHeader.propTypes = {
    heading: PropTypes.string.isRequired,
    backButtonClickedHandler: PropTypes.func.isRequired
};

export default ChoirMembersHeader;
