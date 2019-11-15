import React from "react";
import "./TrackSelectionDropdownMenu.scss";
import TrackSelectionDropdownMenuOption from "./TrackSelectionDropdownMenuOption/TrackSelectionDropdownMenuOption";
import shortid from 'shortid';

const TrackSelectionDropdownMenu = props => {

    return (
        <div id='multiple-selection-dropdown'>
            {props.trackList.map((track, index) => (
                <TrackSelectionDropdownMenuOption
                    key={shortid.generate()}
                    index={index}
                    trackName={track.name}
                    trackIsSelected={track.isSelected}
                    trackListSelectionChanged={props.trackListSelectionChanged}
                />
            ))}
        </div>
    );
};

export default TrackSelectionDropdownMenu;
