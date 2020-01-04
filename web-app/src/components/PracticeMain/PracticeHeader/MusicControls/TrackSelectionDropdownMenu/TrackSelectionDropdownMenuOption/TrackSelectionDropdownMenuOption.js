import React from "react";
import './TrackSelectionDropdownMenuOption.scss';

const TrackSelectionDropdownMenuOption = props => {
    return (
        <div className='multiple-selection-dropdown-option'>
            <input className="multiple-selection-dropdown-option-checkbox"
                type='checkbox'
                checked={props.trackIsSelected}
                onChange={() => {
                    props.trackListSelectionChanged(props.index);
                }}
            />
            <span className="multiple-selection-dropdown-option-name">{props.trackName}</span>
        </div>
    );
};

export default TrackSelectionDropdownMenuOption;
