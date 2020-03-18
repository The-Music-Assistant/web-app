// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeHeader/PracticeHeader.scss
// Description: Renders the practice header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/28/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// Component imports
import MusicControls from "./MusicControls/MusicControls";
import BackButton from "../../Buttons/BackButton/BackButton";
import SelectInput from "../../FormInputs/SelectInput/SelectInput";

// File imports
import destroyAlphaTabApi from "../../../vendors/AlphaTab/destruction";
import * as selectInputColorOptions from "../../FormInputs/SelectInput/colorOptions";

// Style imports
import styles from "./PracticeMusicHeader.module.scss";

const PracticeHeader = props => {
    /**
     * Destroys the AlphaTab API before going back a page
     */
    const backButtonClickedHandler = () => {
        destroyAlphaTabApi().then(props.history.goBack);
    };

    // Returns the JSX to display
    return (
        <div className={styles.practiceHeader}>
            <BackButton
                value='music-selection-back'
                text='Music Selection'
                onClick={backButtonClickedHandler}
            />
            <SelectInput
                value={props.currentPart}
                name='part-selection'
                color={selectInputColorOptions.ORANGE}
                options={props.partList}
                onChange={props.onPartChange}
            />
            <MusicControls />
        </div>
    );
};

PracticeHeader.propTypes = {
    currentPart: PropTypes.string.isRequired,
    partList: PropTypes.arrayOf(PropTypes.string).isRequired,
    onPartChange: PropTypes.func.isRequired
};

export default withRouter(PracticeHeader);
