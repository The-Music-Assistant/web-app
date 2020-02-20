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

// Style imports
import styles from "./ChoirCard.module.scss";

const ChoirCard = props => {
    return (
        <div className={styles.choirCard}>
            <img className={styles.choirCardImg} src={props.headerImgSrc} alt='Choir' />
            <h1 className={styles.choirCardName}>{props.name}</h1>
            <h2 className={styles.choirCardDescription}>{props.description}</h2>
        </div>
    );
};

ChoirCard.propTypes = {
    headerImgSrc: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
};

export default ChoirCard;
