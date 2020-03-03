// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeMain.js
// Description: Renders the practice main component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";

// Component imports
import PracticeHeader from "./PracticeHeader/PracticeHeader";
import PracticeSheetMusic from "./PracticeSheetMusic/PracticeSheetMusic";

// Style imports
import styles from "./PracticeMain.module.scss";

class PracticeMain extends Component {
    /**
     * Renders the PracticeMain component
     */
    render() {
        // Returns the JSX to display
        return (
            <main className={styles.practiceMain}>
                <PracticeHeader />
                <PracticeSheetMusic />
            </main>
        );
    }
}

export default PracticeMain;
