// NPM module imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Component Imports
import RectangularButton from "../../../Buttons/RectangularButton/RectangularButton";
import SmallTextInput from "../../../FormInputs/TextInputs/SmallTextInput/SmallTextInput";

// File imports
import * as rectButtonColorOptions from "../../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as buttonTypes from "../../../Buttons/buttonTypes";
import * as textInputTypes from "../../../FormInputs/TextInputs/textInputTypes";

// Image imports
import closeIconWhite from "../../../../assets/icons/close-icon-white.svg";

// Style imports
import styles from "./ExerciseGenerator.module.scss";

/**
 * Renders the ExerciseGenerator component
 * @component
 * @category Music
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ExerciseGenerator = ({
    numberOfMeasures,
    onGenerateExerciseClose,
    showExercise,
}) => {
    /**
     * The entered start measure
     * {[startMeasureValue, setStartMeasureValue]: [string, function]}
     */
    const [startMeasureValue, setStartMeasureValue] = useState("1");

    /**
     * The entered end measure
     * {[endMeasureValue, setEndMeasureValue]: [string, function]}
     */
    const [endMeasureValue, setEndMeasureValue] = useState("1");

    /**
     * Submits the exercise generation request.
     * Shows the exercise.
     */
    const generateExerciseSubmitHandler = (event) => {
        event.preventDefault();

        // Switches to the exercise view
        showExercise({
            startMeasure: startMeasureValue,
            endMeasure: endMeasureValue,
        });
    };

    /**
     * Updates the measure value in state
     * @param event - The event that triggered this function to be called
     */
    const measureValueChangedHandler = (event) => {
        // Gets the text input value
        if (event.target.name === "start-measure") {
            // Updates the start measure in state
            setStartMeasureValue(event.target.value);
        } else if (event.target.name === "end-measure") {
            // Updates the end measure in state
            setEndMeasureValue(event.target.value);
        }
    };

    // Renders the ExerciseGenerator component
    return (
        <section className={styles.exerciseGenerator}>
            <header className={styles.exerciseGeneratorHeader}>
                {/* Heading */}
                <h1 className={styles.exerciseGeneratorHeaderHeading}>
                    Generate an Exercise
                </h1>

                {/* Close button */}
                <button
                    className={styles.exerciseGeneratorHeaderCloseButton}
                    type="button"
                    onClick={onGenerateExerciseClose}
                >
                    <img
                        className={styles.exerciseGeneratorHeaderCloseButtonImg}
                        src={closeIconWhite}
                        alt="Close Button"
                    />
                </button>
            </header>

            {/* Exercise generation form */}
            <form
                className={styles.exerciseGeneratorForm}
                onSubmit={generateExerciseSubmitHandler}
            >
                <div className={styles.exerciseGeneratorFormMeasureInputs}>
                    {/* Start measure input */}
                    <div className={styles.exerciseGeneratorFormMeasureInput}>
                        <SmallTextInput
                            inputType={textInputTypes.NUMBER}
                            inputWidth="50px"
                            inputName="start-measure"
                            value={startMeasureValue}
                            labelText="Start Measure"
                            isRequired={true}
                            onChange={measureValueChangedHandler}
                            minVal={"1"}
                            maxVal={endMeasureValue}
                        />
                    </div>

                    {/* End measure input */}
                    <div className={styles.exerciseGeneratorFormMeasureInput}>
                        <SmallTextInput
                            inputType={textInputTypes.NUMBER}
                            inputWidth="50px"
                            inputName="end-measure"
                            value={endMeasureValue}
                            labelText="End Measure"
                            isRequired={true}
                            onChange={measureValueChangedHandler}
                            minVal={startMeasureValue}
                            maxVal={numberOfMeasures}
                        />
                    </div>
                </div>

                {/* Generate exercise button */}
                <RectangularButton
                    type={buttonTypes.SUBMIT}
                    value="generate-exercise"
                    title="Go!"
                    backgroundColor={rectButtonColorOptions.ORANGE}
                />
            </form>
        </section>
    );
};

// Prop types for the ExerciseGenerator component
ExerciseGenerator.propTyes = {
    /**
     * The number of measures in the current piece of sheet music
     */
    numberOfMeasures: PropTypes.string.isRequired,

    /**
     * Closes the exercise generator
     */
    onGenerateExerciseClose: PropTypes.func.isRequired,

    /**
     * Switches to the exercise view
     */
    showExercise: PropTypes.func.isRequired,
};

export default ExerciseGenerator;
