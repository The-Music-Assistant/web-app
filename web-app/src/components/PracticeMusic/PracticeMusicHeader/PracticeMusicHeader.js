// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/PracticeHeader.scss
// Description: Renders the practice header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/28/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import { withRouter } from "react-router-dom";

// Component imports
import MusicControls from "./MusicControls/MusicControls";
import BackButton from "../../Buttons/BackButton/BackButton";

// File imports
import destroy from "../../../vendors/AlphaTab/destruction";

// Style imports
import styles from "./PracticeMusicHeader.module.scss";

const PracticeHeader = props => {
    /**
     * Destroys the AlphaTab API before going back a page
     */
    const backButtonClickedHandler = () => {
        destroy().then(props.history.goBack);
    };

    // Returns the JSX to display
    return (
        <div className={styles.practiceHeader}>
            <BackButton
                value='music-selection-back'
                text='Music Selection'
                onClick={backButtonClickedHandler}
            />
            <MusicControls />
        </div>
    );
};

export default withRouter(PracticeHeader);
