// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Style imports
import styles from "./UserWidget.module.scss";

/**
 * Renders the UserWidget component
 * @extends {Component}
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
class UserWidget extends Component {
    /**
     * UserWidget component state
     * @property {boolean} isProfilePictureError - Indicates if there was an error displaying the user's profile picture
     */
    state = {
        isProfilePictureError: false,
    };

    /**
     * Updates state indicating that there was a profile picture error
     * @function
     */
    profilePictureErrorHandler = () => {
        this.setState({ isProfilePictureError: true });
    };

    /**
     * Renders the UserWidget component
     */
    render() {
        return (
            <div className={styles.userWidget}>
                {/* User's profile picture */}
                {this.props.profilePictureUrl && !this.state.isProfilePictureError ? (
                    <img
                        className={styles.userWidgetImg}
                        src={this.props.profilePictureUrl}
                        alt='Profile Pic'
                        onError={this.profilePictureErrorHandler}
                    />
                ) : null}

                {/* User's name */}
                <h2 className={styles.userWidgetName}>{this.props.name}</h2>
            </div>
        );
    }
}

/**
 * Gets the current state from Redux and passes parts of it to the UserWidget component as props.
 * This function is used only by the react-redux connect function.
 * @memberof UserWidget
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the UserWidget component
 */
const mapStateToProps = (state) => {
    return {
        name: state.auth.usersName,
        profilePictureUrl: state.auth.usersPictureUrl,
    };
};

// Prop types for the UserWidget component
UserWidget.propTypes = {
    /**
     * The user's name
     */
    name: PropTypes.string.isRequired,

    /**
     * The user's profile picture url
     */
    profilePictureUrl: PropTypes.string,
};

export default connect(mapStateToProps)(UserWidget);
