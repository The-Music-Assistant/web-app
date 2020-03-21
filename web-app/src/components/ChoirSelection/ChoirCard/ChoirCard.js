// ----------------------------------------------------------------------------
// File Path: src/components/ChoirSelection/ChoirCard/ChoirCard.js
// Description: Renders the choir card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// Image imports
import cameraImg from "../../../assets/icons/camera-white-fa.svg";
import { choirSelectionError } from "../../../vendors/Firebase/logs";

// Style imports
import styles from "./ChoirCard.module.scss";

class ChoirCard extends Component {
    // Component state
    state = {
        imgLoadingError: false
    };

    /**
     * Updates state if there was an error loading the choir image
     */
    imageLoadingErrorHandler = () => {
        choirSelectionError(
            null,
            "Choir image failed to load.",
            "[ChoirCard/imageLoadingErrorHandler]"
        );
        this.setState({ imgLoadingError: true });
    };

    /**
     * Returns the card component (JSX)
     */
    getCardElement = () => {
        // The card element (component) to return
        let cardElement;

        if (this.props.noDescription) {
            // This card component is returned for the "New Choir" card and the "View Pending Choir Requests" card
            cardElement = (
                <div
                    className={`${styles.choirCard} ${styles.choirCardNoDescription} ${
                        styles[this.props.cardColor]
                    }`}
                    onClick={this.props.onClick}>
                    <img
                        className={styles.choirCardNoDescriptionHeaderImg}
                        src={this.props.headerImgSrc}
                        alt={this.props.name}
                    />
                    <h1 className={styles.choirCardNoDescriptionName}>{this.props.name}</h1>
                </div>
            );
        } else {
            cardElement = (
                <div
                    className={`${styles.choirCard} ${styles[this.props.cardColor]}`}
                    onClick={this.props.onClick}>
                    {!this.state.imgLoadingError && this.props.headerImgSrc ? (
                        // Adds an image element if an choir image exists
                        <img
                            className={styles.choirCardHeaderImg}
                            src={this.props.headerImgSrc}
                            loading='lazy'
                            alt='Choir'
                        />
                    ) : (
                        // If a choir image does not exist or can't be loaded, show a placeholder
                        <div
                            className={`${styles.choirCardHeaderImgPlaceholder} ${
                                styles[this.props.cardColor + "Darken"]
                            }`}>
                            <img
                                className={styles.choirCardHeaderImgPlaceholderImg}
                                src={cameraImg}
                                alt='Choir'
                                onError={this.imageLoadingErrorHandler}
                            />
                        </div>
                    )}
                    <h1 className={styles.choirCardName}>{this.props.name}</h1>

                    {/* Only adds a description h2 element if a choir description exists */}
                    {this.props.description ? (
                        <h2 className={styles.choirCardDescription}>{this.props.description}</h2>
                    ) : null}
                </div>
            );
        }

        // Returns the card element
        return cardElement;
    };

    /**
     * Returns the JSX to display
     */
    render() {
        return this.getCardElement();
    }
}

// Prop types for the choir card component
ChoirCard.propTypes = {
    headerImgSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    noDescription: PropTypes.bool.isRequired, // Is true for the "New Choir" and "View Pending Choir Requests" cards
    cardColor: PropTypes.string.isRequired,
    onClick: PropTypes.func
};

export default ChoirCard;
