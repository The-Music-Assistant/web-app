import React from "react";
import MusicInfo from "../MusicInfo/MusicInfo";
import MusicControls from "../MusicControls/MusicControls";
import "./PracticeHeader.scss";

const PracticeHeader = props => {
    return (
        <div id="practice-header">
            <MusicInfo music={props.music} />
            <MusicControls isPaused={props.isPaused} />
        </div>
    );
};

export default PracticeHeader;
