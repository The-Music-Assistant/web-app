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
    state = {
        // trackList: [
        //     {
        //         name: "Track 1",
        //         isSelected: true
        //     },
        //     {
        //         name: "Track 2",
        //         isSelected: true
        //     },
        //     {
        //         name: "Track 3",
        //         isSelected: true
        //     },
        //     {
        //         name: "Track 4",
        //         isSelected: true
        //     },
        //     {
        //         name: "Track 5",
        //         isSelected: true
        //     }
        // ]
    };

    // /**
    //  * Updates track list when a track is selected or deselected
    //  */
    // trackListSelectionChangedHandler = index => {
    //     const updatedTrackList = this.state.trackList;
    //     updatedTrackList[index].isSelected = !updatedTrackList[index].isSelected;
    //     this.setState({
    //         trackList: updatedTrackList
    //     });
    //     console.log(this.state.trackList);
    // }

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
