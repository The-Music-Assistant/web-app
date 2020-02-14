// ----------------------------------------------------------------------------
// File Path: src/components/Header/UserWidget/UserWidget.js
// Description: Renders the user widget component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// File imports
import { signOut } from "../../../store/actions";

// Style imports
import styles from "./UserWidget.module.scss";

const UserWidget = props => {
    // TODO: Don't display the img tag is there is no profile picture

    /**
     * Signs the user out
     */
    const widgetClickedHandler = () => {
        props.signOut();
    };

    // Returns the JSX to display
    return (
        <div className={styles.userWidget} onClick={widgetClickedHandler}>
            <img className={styles.userWidgetImg} src={props.profilePic} alt='Profile Pic' />
            <h2 className={styles.userWidgetName}>{props.name}</h2>
        </div>
    );
};

/**
 * Passes certain redux actions to UserWidget
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut())
    };
};

// Prop types for the UserWidget component
UserWidget.propTypes = {
    profilePic: PropTypes.string,
    name: PropTypes.string.isRequired,
    signOut: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(UserWidget);
