import React, { Component } from "react";
import PracticeHeader from "./PracticeHeader/PracticeHeader";
import PracticeSheetMusic from "./PracticeSheetMusic/PracticeSheetMusic";
import "./PracticeMain.scss";

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

    render() {
        return (
            <main id='practice-main'>
                <PracticeHeader/>
                <PracticeSheetMusic />
            </main>
        );
    }
}

export default PracticeMain;