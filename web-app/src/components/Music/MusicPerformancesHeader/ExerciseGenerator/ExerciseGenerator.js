// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/MusicPerformancesHeader/ExerciseGenerator/ExerciseGenerator.js
// Description: Renders the ExerciseGenerator component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/25/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// Component Imports
import RectangularButton from "../../../Buttons/RectangularButton/RectangularButton";

// File imports
import * as rectButtonColorOptions from "../../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as buttonTypes from "../../../Buttons/buttonTypes";

// Style imports
import styles from "./ExerciseGenerator.module.scss";

class ExerciseGenerator extends Component {
    // Component state
    state = {
        startMeasureValue: 0,
        endMeasureValue: 0
    };

    generateExerciseButtonClickedHandler = () => {
        console.log(this.state.startMeasureValue, this.state.endMeasureValue);
    };

    /**
     * Renders the component
     */
    render() {
        // Returns the JSX to render
        return (
            <div className={styles.exerciseGenerator}>
                <h1 className={styles.exerciseGeneratorHeading}>Generate an Exercise</h1>
                <p className={styles.exerciseGeneratorInstructions}>
                    Enter measure numbers or highlight the measures by clicking and dragging on the
                    sheet music
                </p>
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value='create-exercise-generation'
                    text='Create an Exercise'
                    backgroundColor={rectButtonColorOptions.ORANGE}
                    onClick={this.generateExerciseButtonClickedHandler}
                />
            </div>
        );
    }
}

// Prop types for the ExerciseGenerator component
ExerciseGenerator.propTyes = {};

export default ExerciseGenerator;
