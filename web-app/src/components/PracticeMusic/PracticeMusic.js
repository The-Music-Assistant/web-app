// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMusic/PracticeMusic.js
// Description: Renders the practice music component
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
import styles from "./PracticeMusic.module.scss";

class PracticeMusic extends Component {
    /**
     * Renders the component
     */
    render() {
        // Returns the JSX to display
        return (
            <main className={styles.practiceMusic}>
                <PracticeHeader />
                <PracticeSheetMusic />
            </main>
        );
    }
}

export default PracticeMusic;
