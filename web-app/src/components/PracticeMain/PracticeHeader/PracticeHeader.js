// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/PracticeHeader.scss
// Description: Renders the practice header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/28/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import {withRouter} from "react-router-dom";

// Image imports
import leftArrowBlue from "../../../assets/icons/left-arrow-blue-fa.svg";

// Component imports
import MusicControls from "./MusicControls/MusicControls";

// Style imports
import styles from "./PracticeHeader.module.scss";

const PracticeHeader = props => {
    // const handleBackButtonClicked = () => {
    //     props.history.goBack();
    // };

    // Returns the JSX to display
    return (
        <div className={styles.practiceHeader}>
            {/* <button className={styles.practiceHeaderBackButton} onClick={handleBackButtonClicked}>
                <img
                    className={styles.practiceHeaderBackButtonArrow}
                    src={leftArrowBlue}
                    alt='Back Button'
                />
                <span className={styles.practiceHeaderBackButtonText}>Latest Pieces</span>
            </button> */}

            <MusicControls />
        </div>
    );
};

export default withRouter(PracticeHeader);
