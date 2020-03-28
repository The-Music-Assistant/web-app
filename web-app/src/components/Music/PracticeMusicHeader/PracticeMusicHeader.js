// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeMusicHeader/PracticeMusicHeader.js
// Description: Renders the PracticeMusicHeader component
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
    const viewPerformanceButtonClickedHandler = () => {
        const routeUrl = `${props.match.url.substring(
            0,
            props.match.url.lastIndexOf("/")
        )}/performance`;

        props.history.replace(routeUrl);
    };

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
            <div className={styles.practiceHeaderViewPerformanceButton}>
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value='performance'
                    text='View Performance'
                    backgroundColor={rectButtonColorOptions.GREEN}
                    onClick={viewPerformanceButtonClickedHandler}
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
