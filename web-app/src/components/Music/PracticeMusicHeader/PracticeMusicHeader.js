// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import MusicControls from "./MusicControls/MusicControls";
import SelectInput from "../../FormInputs/SelectInput/SelectInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";

// File imports
import * as selectInputColorOptions from "../../FormInputs/SelectInput/selectInputColorOptions";
import * as buttonTypes from "../../Buttons/buttonTypes";
import * as rectButtonColorOptions from "../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as musicViewOptions from "../../Music/musicViewOptions";

// Style imports
import styles from "./PracticeMusicHeader.module.scss";

/**
 * Renders the PracticeMusicHeader component.
 * This component is used when a user is practicing music or practicing an exercise.
 * @component
 * @category Music
 * @author Dan Levy <danlevy124@gmail.com>
 */
const PracticeMusicHeader = (props) => {
    /**
     * Gets the correct component for the left side of the header
     */
    const getPartSelectionDropdownOrPracticeMusicButton = () => {
        return props.currentView === musicViewOptions.PRACTICE ? (
            // Returns a part selection dropdown
            <SelectInput
                value={props.currentPart}
                name="part-selection"
                color={selectInputColorOptions.ORANGE}
                options={props.partList}
                onChange={props.onPartChange}
            />
        ) : (
            // Returns a button that links to practice view
            <RectangularButton
                type={buttonTypes.BUTTON}
                value="practice"
                title="Practice Music"
                backgroundColor={rectButtonColorOptions.ORANGE}
                onClick={props.switchToPractice}
            />
        );
    };

    // Returns the JSX to render
    return (
        <header className={styles.PracticeMusicHeader}>
            {/* Left side dropdown or button */}
            {getPartSelectionDropdownOrPracticeMusicButton()}

            {/* Music controls */}
            <MusicControls />

            {/* A button that links to the performance view */}
            {props.doesUserGetFeedback ? (
                <div
                    className={styles.PracticeMusicHeaderViewPerformanceButton}
                >
                    <RectangularButton
                        type={buttonTypes.BUTTON}
                        value="performance"
                        title="View Performance"
                        backgroundColor={rectButtonColorOptions.GREEN}
                        onClick={props.switchToPerformance}
                    />
                </div>
            ) : null}
        </header>
    );
};

// Prop types for the PracticeMusicHeader component
PracticeMusicHeader.propTypes = {
    /**
     * The current music view
     */
    currentView: PropTypes.oneOf(Object.values(musicViewOptions)),

    /**
     * The currently selected part (track) of the sheet music (e.g. Alto)
     */
    currentPart: PropTypes.string,

    /**
     * The list of all available parts (tracks) for the sheet music
     */
    partList: PropTypes.arrayOf(PropTypes.string),

    /**
     * Part change handler
     */
    onPartChange: PropTypes.func,

    /**
     * Switch to practice handler
     */
    switchToPractice: PropTypes.func,

    /**
     * Switch to performance handler
     */
    switchToPerformance: PropTypes.func.isRequired,

    /**
     * Indicates if the user gets feedback
     */
    doesUserGetFeedback: PropTypes.bool.isRequired,
};

export default PracticeMusicHeader;
