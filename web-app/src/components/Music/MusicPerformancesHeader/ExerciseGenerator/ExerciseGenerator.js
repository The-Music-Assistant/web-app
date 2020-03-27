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
import SmallTextInput from "../../../FormInputs/TextInputs/SmallTextInput/SmallTextInput";

// File imports
import * as rectButtonColorOptions from "../../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as buttonTypes from "../../../Buttons/buttonTypes";
import * as textInputTypes from "../../../FormInputs/TextInputs/textInputTypes";

// Image imports
import closeIconWhite from "../../../../assets/icons/close-icon-white.svg";

// Style imports
import styles from "./ExerciseGenerator.module.scss";

class ExerciseGenerator extends Component {
    // Component state
    state = {
        startMeasureValue: "0",
        endMeasureValue: "0"
    };

    generateExerciseSubmitHandler = event => {
        event.preventDefault();
        console.log(this.state.startMeasureValue, this.state.endMeasureValue);
    };

    measureValueChangedHandler = event => {
        console.log(event.target.value);
        if (event.target.name === "start-measure") {
            this.setState({
                startMeasureValue:
                    Number(event.target.value) >= 0 && event.target.value !== "-0"
                        ? event.target.value
                        : "0"
            });
        } else if (event.target.name === "end-measure") {
            this.setState({
                endMeasureValue:
                    (!event.target.value || Number(event.target.value) >= 0) &&
                    event.target.value !== "-0"
                        ? event.target.value
                        : ""
            });
        }
    };

    /**
     * Renders the component
     */
    render() {
        // Returns the JSX to render
        return (
            <div className={styles.exerciseGenerator}>
                <div className={styles.exerciseGeneratorHeader}>
                    <div></div>
                    <h1 className={styles.exerciseGeneratorHeaderHeading}>Generate an Exercise</h1>
                    <button
                        className={styles.exerciseGeneratorHeaderCloseButton}
                        type='button'
                        onClick={this.props.onGenerateExerciseClose}>
                        <img
                            className={styles.exerciseGeneratorHeaderCloseButtonImg}
                            src={closeIconWhite}
                            alt='Close Button'
                        />
                    </button>
                </div>
                <p className={styles.exerciseGeneratorInstructions}>
                    Enter measure numbers or highlight the measures by clicking and dragging on the
                    sheet music.
                </p>
                <form
                    className={styles.exerciseGeneratorForm}
                    onSubmit={this.generateExerciseSubmitHandler}>
                    <div className={styles.exerciseGeneratorFormMeasureInputs}>
                        <div className={styles.exerciseGeneratorFormMeasureInput}>
                            <SmallTextInput
                                inputType={textInputTypes.NUMBER}
                                inputWidth='50px'
                                inputName='start-measure'
                                value={this.state.startMeasureValue}
                                labelText='Start Measure'
                                isRequired={true}
                                onChange={this.measureValueChangedHandler}
                            />
                        </div>
                        <div className={styles.exerciseGeneratorFormMeasureInput}>
                            <SmallTextInput
                                inputType={textInputTypes.NUMBER}
                                inputWidth='50px'
                                inputName='end-measure'
                                value={this.state.endMeasureValue}
                                labelText='End Measure'
                                isRequired={true}
                                onChange={this.measureValueChangedHandler}
                            />
                        </div>
                    </div>
                    <RectangularButton
                        type={buttonTypes.SUBMIT}
                        value='generate-exercise'
                        text='Go!'
                        backgroundColor={rectButtonColorOptions.ORANGE}
                    />
                </form>
            </div>
        );
    }
}

// Prop types for the ExerciseGenerator component
ExerciseGenerator.propTyes = {
    onGenerateExerciseClose: PropTypes.func.isRequired
};

export default ExerciseGenerator;
