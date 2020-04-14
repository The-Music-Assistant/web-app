// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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

/**
 * Renders the ExerciseGenerator component
 * @extends {Component}
 * @component
 * @category Music
 * @author Dan Levy <danlevy124@gmail.com>
 */
class ExerciseGenerator extends Component {
    /**
     * ExerciseGenerator component state
     * @property {string} startMeasureValue - The entered start measure
     * @property {string} endMeasureValue - The entered end measure
     */
    state = {
        startMeasureValue: "1",
        endMeasureValue: "1",
    };

    /**
     * Submits the exercise generation request.
     * Shows the exercise.
     * @function
     */
    generateExerciseSubmitHandler = (event) => {
        event.preventDefault();

        // Tells Redux to request the exercise
        this.props.generateExercise(
            this.state.startMeasureValue,
            this.state.endMeasureValue
        );

        // Switches to the exercise view
        this.props.showExercise();
    };

    /**
     * Updates the measure value in state
     * @param event - The event that triggered this function to be called
     * @function
     */
    measureValueChangedHandler = (event) => {
        // Gets the text input value
        if (event.target.name === "start-measure") {
            // Updates the start measure in state
            this.setState({
                startMeasureValue: event.target.value,
            });
        } else if (event.target.name === "end-measure") {
            // Updates the end measure in state
            this.setState({
                endMeasureValue: event.target.value,
            });
        }
    };

    /**
     * Renders the ExerciseGenerator component
     */
    render() {
        // Returns the JSX to render
        return (
            <div className={styles.exerciseGenerator}>
                <div className={styles.exerciseGeneratorHeader}>
                    {/* Empty div on the left side (used for centering content) */}
                    <div></div>

                    {/* Heading */}
                    <h1 className={styles.exerciseGeneratorHeaderHeading}>
                        Generate an Exercise
                    </h1>

                    {/* Close button */}
                    <button
                        className={styles.exerciseGeneratorHeaderCloseButton}
                        type="button"
                        onClick={this.props.onGenerateExerciseClose}
                    >
                        <img
                            className={
                                styles.exerciseGeneratorHeaderCloseButtonImg
                            }
                            src={closeIconWhite}
                            alt="Close Button"
                        />
                    </button>
                </div>

                {/* Exercise generation form */}
                <form
                    className={styles.exerciseGeneratorForm}
                    onSubmit={this.generateExerciseSubmitHandler}
                >
                    <div className={styles.exerciseGeneratorFormMeasureInputs}>
                        {/* Start measure input */}
                        <div
                            className={styles.exerciseGeneratorFormMeasureInput}
                        >
                            <SmallTextInput
                                inputType={textInputTypes.NUMBER}
                                inputWidth="50px"
                                inputName="start-measure"
                                value={this.state.startMeasureValue}
                                labelText="Start Measure"
                                isRequired={true}
                                onChange={this.measureValueChangedHandler}
                                minVal={"1"}
                                maxVal={this.state.endMeasureValue}
                            />
                        </div>

                        {/* End measure input */}
                        <div
                            className={styles.exerciseGeneratorFormMeasureInput}
                        >
                            <SmallTextInput
                                inputType={textInputTypes.NUMBER}
                                inputWidth="50px"
                                inputName="end-measure"
                                value={this.state.endMeasureValue}
                                labelText="End Measure"
                                isRequired={true}
                                onChange={this.measureValueChangedHandler}
                                minVal={this.state.startMeasureValue}
                                maxVal={this.props.numberOfMeasures}
                            />
                        </div>
                    </div>

                    {/* Generate exercise button */}
                    <RectangularButton
                        type={buttonTypes.SUBMIT}
                        value="generate-exercise"
                        text="Go!"
                        backgroundColor={rectButtonColorOptions.ORANGE}
                    />
                </form>
            </div>
        );
    }
}

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
     * Tells Redux to request the exercise
     */
    generateExercise: PropTypes.func.isRequired,

    /**
     * Switches to the exercise view
     */
    showExercise: PropTypes.func.isRequired,
};

/**
 * Passes certain Redux actions to the ExerciseGenerator component as props.
 * This function is used only by the react-redux connect function.
 * @memberof ExerciseGenerator
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the ExerciseGenerator component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        generateExercise: (startMeasure, endMeasure) =>
            dispatch(exerciseRequested(startMeasure, endMeasure)),
    };
};

export default withRouter(connect(null, mapDispatchToProps)(ExerciseGenerator));
