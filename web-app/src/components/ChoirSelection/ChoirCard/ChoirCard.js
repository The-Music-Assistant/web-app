// ----------------------------------------------------------------------------
// File Path: src/components/ChoirSelection/ChoirCard/ChoirCard.js
// Description: Renders the choir card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Image imports
import cameraImg from "../../../assets/icons/camera-white-fa.svg";

// Style imports
import styles from "./ChoirCard.module.scss";

const ChoirCard = props => {
    let cardElement;

    if (props.noDescription) {
        cardElement = (
            <div className={`${styles.choirCardNoDescription} ${styles[props.cardColor]}`}>
                <img
                    className={styles.choirCardNoDescriptionHeaderImg}
                    src={props.headerImgSrc}
                    alt={props.name}
                />
                <h1 className={styles.choirCardNoDescriptionName}>{props.name}</h1>
            </div>
        );
    } else {
        cardElement = (
            <div className={`${styles.choirCard} ${styles[props.cardColor]}`}>
                {props.headerImgSrc ? (
                    <img
                        className={styles.choirCardHeaderImg}
                        src={props.headerImgSrc}
                        alt='Choir'
                    />
                ) : (
                    <div className={`${styles.choirCardHeaderImgPlaceholder} ${styles[props.cardColor + "Darken"]}`}>
                        <img
                            className={styles.choirCardHeaderImgPlaceholderImg}
                            src={cameraImg}
                            alt='Choir'
                        />
                    </div>
                )}
                <h1 className={styles.choirCardName}>{props.name}</h1>
                {props.description ? (
                    <h2 className={styles.choirCardDescription}>{props.description}</h2>
                ) : null}
            </div>
        );
    }

    return cardElement;
};

ChoirCard.propTypes = {
    headerImgSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    noDescription: PropTypes.bool.isRequired,
    cardColor: PropTypes.string.isRequired
};

export default ChoirCard;
