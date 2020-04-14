// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./memberCardColorOptions";

// Style imports
import styles from "./MemberCard.module.scss";

/**
 * Renders the MemberCard component.
 * Contains a member's profile.
 * @component
 * @category ChoirMembers
 * @author Dan Levy <danlevy124@gmail.com>
 */
class MemberCard extends Component {
    /**
     * MemberCard component state
     * @property {boolean} profilePicLoadError - Indicates if there was an error loading the member's profile picture
     */
    state = {
        profilePicLoadError: false,
    };

    /**
     * Updates state to indicate that there was an error loading the member's profile picture
     * @function
     */
    profilePicLoadErrorHandler = () => {
        this.setState({ profilePicLoadError: true });
    };

    /**
     * Gets the correct image component
     * @function
     * @returns {object} An image component (JSX)
     */
    getImageComponent = () => {
        if (!this.props.profilePictureSrc || this.state.profilePicLoadError) {
            // Returns a placeholder image
            return (
                <div className={styles.memberCardImgPlaceholder}>
                    {this.props.name.length > 0 ? (
                        <h1
                            className={`${
                                styles.memberCardImgPlaceholderLetter
                            } ${
                                styles[
                                    this.props.color + "ImgPlaceholderLetter"
                                ]
                            }`}
                        >
                            {this.props.name.substring(0, 1)}
                        </h1>
                    ) : null}
                </div>
            );
        } else {
            // Returns the user profile picture
            return (
                <img
                    className={styles.memberCardImg}
                    src={this.props.profilePictureSrc}
                    alt="User Avatar"
                />
            );
        }
    };

    /**
     * Renders the MemberCard component
     */
    render() {
        return (
            <div className={`${styles.memberCard} ${styles[this.props.color]}`}>
                {this.getImageComponent()}
                <h1 className={styles.memberCardName}>{this.props.name}</h1>
                <h2 className={styles.memberCardRoles}>{this.props.roles}</h2>
            </div>
        );
    }
}

// Prop types for MemberCard component
MemberCard.propTypes = {
    /**
     * The member's name
     */
    name: PropTypes.string.isRequired,

    /**
     * The member's role(s) (e.g. alto)
     */
    roles: PropTypes.string.isRequired,

    /**
     * The member's profile picture file path
     */
    profilePictureSrc: PropTypes.string,

    /**
     * The background color of the component.
     * See [options]{@link module:memberCardColorOptions}.
     */
    color: PropTypes.oneOf([
        colorOptions.PRIMARY_BLUE,
        colorOptions.SECONDARY_BLUE,
        colorOptions.TERTIARY_BLUE,
        colorOptions.GREEN,
        colorOptions.ORANGE,
        colorOptions.RED,
    ]).isRequired,
};

export default MemberCard;
