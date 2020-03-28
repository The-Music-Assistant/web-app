// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/MusicPerformanceHeader/ExerciseGenerator/ExerciseGenerator.js
// Description: Renders the ExerciseGenerator component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/25/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Component Imports
import RectangularButton from "../../../Buttons/RectangularButton/RectangularButton";
import SmallTextInput from "../../../FormInputs/TextInputs/SmallTextInput/SmallTextInput";

// File imports
import * as rectButtonColorOptions from "../../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as buttonTypes from "../../../Buttons/buttonTypes";
import * as textInputTypes from "../../../FormInputs/TextInputs/textInputTypes";
import { exerciseRequested } from "../../../../store/actions";

// Image imports
import closeIconWhite from "../../../../assets/icons/close-icon-white.svg";

// Style imports
import styles from "./ExerciseGenerator.module.scss";

class ExerciseGenerator extends Component {
    // Component state
    state = {
        startMeasureValue: "1",
        endMeasureValue: "1"
    };

    generateExerciseSubmitHandler = event => {
        event.preventDefault();
        this.props.generateExercise(this.state.startMeasureValue, this.state.endMeasureValue);
    };

    measureValueChangedHandler = event => {
        // Get text input value
        if (event.target.name === "start-measure") {
            // Update start measure in state
            this.setState({
                startMeasureValue: event.target.value
            });
        } else if (event.target.name === "end-measure") {
            // Update end measure in state
            this.setState({
                endMeasureValue: event.target.value
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
                                minVal={"1"}
                                maxVal={this.state.endMeasureValue}
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
                                minVal={this.state.startMeasureValue}
                                maxVal={this.props.numberOfMeasures}
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
    numberOfMeasures: PropTypes.string.isRequired,
    onGenerateExerciseClose: PropTypes.func.isRequired,
    generateExercise: PropTypes.func.isRequired
};

/**
 * Passes certain redux actions to the ExerciseGenerator component
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        generateExercise: (startMeasure, endMeasure) =>
            dispatch(exerciseRequested(startMeasure, endMeasure))
    };
};

export default connect(null, mapDispatchToProps)(ExerciseGenerator);
