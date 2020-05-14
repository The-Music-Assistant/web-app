// NPM module imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component imports
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import ExerciseGenerator from "./ExerciseGenerator/ExerciseGenerator";

// File imports
import * as rectButtonColorOptions from "../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as buttonTypes from "../../Buttons/buttonTypes";

// Style imports
import styles from "./MusicPerformanceHeader.module.scss";

/**
 * Renders the MusicPerformanceHeader component.
 * This component is used when a user is viewing performance.
 * @category Music
 * @component
 */
const MusicPerformanceHeader = ({
    numberOfMeasures,
    switchToPractice,
    switchToExercise,
}) => {
    /**
     * Indicates if the exercise generator should be displayed
     * {[shouldDisplayExerciseGenerator, setShouldDisplayExerciseGenerator]: [boolean, function]}
     */
    const [
        shouldDisplayExerciseGenerator,
        setShouldDisplayExerciseGenerator,
    ] = useState(false);

    /**
     * Flips shouldDisplayExerciseGenerator property in state
     */
    const showOrHideExerciseGenerator = () => {
        setShouldDisplayExerciseGenerator((prevState) => !prevState);
    };

    /**
     * Gets an exercise generator component or a button to open the exercise generator
     * @returns A ExerciseGenerator component or a RectangularButton component
     */
    const getExerciseGeneratorOrButton = () => {
        if (shouldDisplayExerciseGenerator) {
            // Returns the ExerciseGenerator component
            return (
                <ExerciseGenerator
                    numberOfMeasures={numberOfMeasures}
                    onGenerateExerciseClose={showOrHideExerciseGenerator}
                    showExercise={switchToExercise}
                />
            );
        } else {
            // Returns a button that will open the ExerciseGenerator component
            return (
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value="create-exercise-generation"
                    title="Create an Exercise"
                    backgroundColor={rectButtonColorOptions.ORANGE}
                    onClick={showOrHideExerciseGenerator}
                />
            );
        }
    };

    /**
     * Renders the MusicPerformanceHeader component
     */
    return (
        <header className={styles.MusicPerformanceHeader}>
            {/* An exercise generator or a button */}
            {getExerciseGeneratorOrButton()}

            {/* A button to switch to the practice view */}
            <RectangularButton
                type={buttonTypes.BUTTON}
                value="practice"
                title="Practice Music"
                backgroundColor={rectButtonColorOptions.GREEN}
                onClick={switchToPractice}
            />
        </header>
    );
};

// Prop types for the MusicPerformanceHeader component
MusicPerformanceHeader.propTypes = {
    /**
     * The number of measures in the current piece of sheet music
     */
    numberOfMeasures: PropTypes.string.isRequired,

    /**
     * Switches to the practice view
     */
    switchToPractice: PropTypes.func.isRequired,

    /**
     * Switches to the exercise view
     */
    switchToExercise: PropTypes.func.isRequired,
};

export default MusicPerformanceHeader;
