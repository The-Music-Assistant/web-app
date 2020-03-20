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
import SelectInput from "../../FormInputs/SelectInput/SelectInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";

// File imports
import * as selectInputColorOptions from "../../FormInputs/SelectInput/colorOptions";
import * as buttonTypes from "../../Buttons/buttonTypes";
import * as rectButtonColorOptions from "../../Buttons/RectangularButton/rectangularButtonColorOptions";

// Style imports
import styles from "./PracticeMusicHeader.module.scss";

const PracticeHeader = props => {
    // TODO: Move to performance view
    const viewPerformancesButtonClickedHandler = () => {};

    // Returns the JSX to display
    return (
        <div className={styles.practiceHeader}>
            <SelectInput
                value={props.currentPart}
                name='part-selection'
                color={selectInputColorOptions.ORANGE}
                options={props.partList}
                onChange={props.onPartChange}
            />
            <MusicControls />
            <div className={styles.practiceHeaderViewPerformancesButton}>
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value='performances'
                    text='View Performances'
                    backgroundColor={rectButtonColorOptions.GREEN}
                    onClick={viewPerformancesButtonClickedHandler}
                />
            </div>
        </div>
    );
};

// Prop types for the PracticeHeader component
PracticeHeader.propTypes = {
    currentPart: PropTypes.string.isRequired,
    partList: PropTypes.arrayOf(PropTypes.string).isRequired,
    onPartChange: PropTypes.func.isRequired
};

export default withRouter(PracticeHeader);
