// ----------------------------------------------------------------------------
// File Path: src/components/Header/UserWidget/UserWidget.js
// Description: Renders the user widget component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// File imports
import { signOut } from "../../../store/actions";

// Image imports
import downArrow from "../../../assets/icons/down-arrow-white-fa.svg";

// Style imports
import styles from "./UserWidget.module.scss";

class UserWidget extends Component {
    // Component state
    state = {
        profilePictureError: false
    };

    /**
     * Signs the user out
     */
    widgetClickedHandler = () => {
        if (window.confirm("Do you want to sign out?")) {
            this.props.signOut();
        }
    };

    profilePictureErrorHandler = () => {
        this.setState({ profilePictureError: true });
    };

    /**
     * Renders the User Widget component
     */
    render() {
        // Returns the JSX to display
        return (
            <div className={styles.userWidget} onClick={this.widgetClickedHandler}>
                {this.props.profilePictureUrl && !this.state.profilePictureError ? (
                    <img
                        className={styles.userWidgetImg}
                        src={this.props.profilePictureUrl}
                        alt='Profile Pic'
                        onError={this.profilePictureErrorHandler}
                    />
                ) : null}
                <h2 className={styles.userWidgetName}>{this.props.name}</h2>
                <img className={styles.userWidgetDownArrow} src={downArrow} alt='Down Arrow' />
            </div>
        );
    }
}

/**
 * Gets the current state from Redux and passes it to the UserWidget component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        name: state.auth.usersName,
        profilePictureUrl: state.auth.usersPictureUrl
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(UserWidget);
