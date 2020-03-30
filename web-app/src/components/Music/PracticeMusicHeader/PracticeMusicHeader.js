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
import * as musicPageOptions from "../../Music/musicPageOptions";

// Style imports
import styles from "./PracticeMusicHeader.module.scss";

const PracticeMusicHeader = props => {
    const viewPerformanceButtonClickedHandler = () => {
        const routeUrl = getNewUrl("performance");
        props.history.replace(routeUrl);
    };

    const practiceMusicButtonClickedHandler = () => {
        const routeUrl = getNewUrl("practice");
        props.history.replace(routeUrl);
    };

    const getNewUrl = endString => {
        return `${props.match.url.substring(0, props.match.url.lastIndexOf("/"))}/${endString}`;
    };

    const getPartSelectionDropdownOrPracticeMusicButton = () => {
        return props.pageType === musicPageOptions.PRACTICE ? (
            <SelectInput
                value={props.currentPart}
                name='part-selection'
                color={selectInputColorOptions.ORANGE}
                options={props.partList}
                onChange={props.onPartChange}
            />
        ) : (
            <RectangularButton
                type={buttonTypes.BUTTON}
                value='practice'
                text='Practice Music'
                backgroundColor={rectButtonColorOptions.ORANGE}
                onClick={practiceMusicButtonClickedHandler}
            />
        );
    };

    // Returns the JSX to display
    return (
        <div className={styles.PracticeMusicHeader}>
            {getPartSelectionDropdownOrPracticeMusicButton()}
            <MusicControls />
            <div className={styles.PracticeMusicHeaderViewPerformanceButton}>
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

// Prop types for the PracticeMusicHeader component
PracticeMusicHeader.propTypes = {
    pageType: PropTypes.oneOf([
        musicPageOptions.PRACTICE,
        musicPageOptions.PERFORMANCE,
        musicPageOptions.EXERCISE
    ]),
    currentPart: PropTypes.string,
    partList: PropTypes.arrayOf(PropTypes.string),
    onPartChange: PropTypes.func
};

export default withRouter(PracticeMusicHeader);
