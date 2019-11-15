import React from "react";
import MusicControls from "./MusicControls/MusicControls";
import "./PracticeHeader.scss";
import leftArrowBlue from "../../../assets/icons/left-arrow-blue-fa.svg";

const PracticeHeader = props => {
    const handleBackButtonClicked = () => {
        // TODO: Add logic to go back to the practice selection page
    };

    return (
        <div id='practice-header'>
            <button id='practice-header-back-button' onClick={handleBackButtonClicked}>
                <img id='practice-header-back-button-arrow' src={leftArrowBlue} alt='Back Button' />
                <span id='practice-header-back-button-text'>Latest Pieces</span>
            </button>
            <MusicControls
                trackList={props.trackList}
                trackListSelectionChanged={props.trackListSelectionChanged}
            />
            <div></div>
        </div>
    );
};

export default PracticeHeader;
