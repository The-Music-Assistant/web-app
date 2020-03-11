// ----------------------------------------------------------------------------
// File Path: src/components/Choir/MemberCard/MemberCard.js
// Description: Renders the member card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/8/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./colorOptions";

// Style imports
import styles from "./MemberCard.module.scss";

class MemberCard extends Component {
    // Component state
    state = {
        profilePicLoadError: false
    };

    profilePicLoadErrorHandler = () => {
        this.setState({ profilePicLoadError: true });
    };

    render() {
        let image;
        if (!this.props.profilePictureSrc || this.state.profilePicLoadError) {
            image = (
                <div className={styles.memberCardImgPlaceholder}>
                    {this.props.name.length > 0 ? (
                        <h1
                            className={`${styles.memberCardImgPlaceholderLetter} ${
                                styles[this.props.color + "ImgPlaceholderLetter"]
                            }`}>
                            {this.props.name.substring(0, 1)}
                        </h1>
                    ) : null}
                </div>
            );
        } else {
            image = (
                <img
                    className={styles.memberCardImg}
                    src={this.props.profilePictureSrc}
                    alt='User Avatar'
                />
            );
        }

        return (
            <div className={`${styles.memberCard} ${styles[this.props.color]}`}>
                {image}
                <h1 className={styles.memberCardName}>{this.props.name}</h1>
                <h2 className={styles.memberCardRoles}>{this.props.roles}</h2>
            </div>
        );
    }
}

// Prop types for MemberCard component
MemberCard.propTypes = {
    name: PropTypes.string.isRequired,
    roles: PropTypes.string.isRequired,
    profilePictureSrc: PropTypes.string,
    color: PropTypes.oneOf([
        colorOptions.PRIMARY_BLUE,
        colorOptions.SECONDARY_BLUE,
        colorOptions.TERTIARY_BLUE,
        colorOptions.GREEN,
        colorOptions.ORANGE,
        colorOptions.RED
    ])
};

export default MemberCard;
