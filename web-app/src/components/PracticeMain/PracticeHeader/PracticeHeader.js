// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/PracticeHeader.scss
// Description: Renders the practice header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/28/2019
// ----------------------------------------------------------------------------

import React from "react";
import MusicControls from "./MusicControls/MusicControls";
import styles from "./PracticeHeader.module.scss";
import leftArrowBlue from "../../../assets/icons/left-arrow-blue-fa.svg";

const PracticeHeader = props => {
    const handleBackButtonClicked = () => {
        // TODO: Add logic to go back to the practice selection page
    };

    return (
        <div className={styles.practiceHeader}>
            <button className={styles.practiceHeaderBackButton} onClick={handleBackButtonClicked}>
                <img className={styles.practiceHeaderBackButtonArrow} src={leftArrowBlue} alt='Back Button' />
                <span className={styles.practiceHeaderBackButtonText}>Latest Pieces</span>
            </button>

            <MusicControls />
        </div>
    );
};

export default PracticeHeader;
