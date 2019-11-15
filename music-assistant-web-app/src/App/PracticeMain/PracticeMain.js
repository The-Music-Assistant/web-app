import React, { Component } from "react";
import PracticeHeader from "./PracticeHeader/PracticeHeader";
import "./PracticeMain.scss";
import sheetMusicPlaceholder from "../../assets/images/sheet-music-placeholder.png";

class PracticeMain extends Component {
    state = {
        trackList: [
            {
                name: "Track 1",
                isSelected: true
            },
            {
                name: "Track 2",
                isSelected: true
            },
            {
                name: "Track 3",
                isSelected: true
            },
            {
                name: "Track 4",
                isSelected: true
            },
            {
                name: "Track 5",
                isSelected: true
            }
        ]
    };

    trackListSelectionChangedHandler = index => {
        const updatedTrackList = this.state.trackList;
        updatedTrackList[index].isSelected = !updatedTrackList[index].isSelected;
        this.setState({
            trackList: updatedTrackList
        });
        console.log(this.state.trackList);
    }

    render() {
        return (
            <main id='practice-main'>
                <PracticeHeader
                    trackList={this.state.trackList}
                    trackListSelectionChanged={this.trackListSelectionChangedHandler}
                />
                <img
                    id='sheet-music-placeholder-img'
                    src={sheetMusicPlaceholder}
                    alt='Placeholder'
                />
            </main>
        );
    }
}

export default PracticeMain;
