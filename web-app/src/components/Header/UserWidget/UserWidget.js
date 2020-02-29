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

// Style imports
import styles from "./UserWidget.module.scss";

class UserWidget extends Component {
    // Component state
    state = {
        profilePictureError: false
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
            <div className={styles.userWidget}>
                {this.props.profilePictureUrl && !this.state.profilePictureError ? (
                    <img
                        className={styles.userWidgetImg}
                        src={this.props.profilePictureUrl}
                        alt='Profile Pic'
                        onError={this.profilePictureErrorHandler}
                    />
                ) : null}
                <h2 className={styles.userWidgetName}>{this.props.name}</h2>
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

// Prop types for the UserWidget component
UserWidget.propTypes = {
    profilePic: PropTypes.string,
    name: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(UserWidget);
