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
import AlphaTabRunner from "../PracticeSheetMusic/AlphaTabRunner";

// Style imports
import styles from "./PracticeHeader.module.scss";

const PracticeHeader = props => {
    const backButtonClickedHandler = () => {
        AlphaTabRunner.destroy().then(props.history.goBack);
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
