// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

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
 * @extends {Component}
 * @category Music
 * @component
 */
class MusicPerformanceHeader extends Component {
    /**
     * MusicPerformanceHeader component state
     * @property {boolean} shouldDisplayExerciseGenerator - Indicates of the exercise generator should be displayed
     */
    state = {
        shouldDisplayExerciseGenerator: false,
    };

    /**
     * Flips shouldDisplayExerciseGenerator property in state
     * @function
     */
    showOrHideExerciseGenerator = () => {
        this.setState((prevState) => {
            return {
                shouldDisplayExerciseGenerator: !prevState.shouldDisplayExerciseGenerator,
            };
        });
    };

    getExerciseGeneratorOrButton = () => {
        if (this.state.shouldDisplayExerciseGenerator) {
            // Returns the ExerciseGenerator component
            return (
                <ExerciseGenerator
                    numberOfMeasures={this.props.numberOfMeasures}
                    onGenerateExerciseClose={this.showOrHideExerciseGenerator}
                    showExercise={this.props.switchToExercise}
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
                    onClick={this.showOrHideExerciseGenerator}
                />
            );
        }
    };

    /**
     * Renders the MusicPerformanceHeader component
     */
    render() {
        return (
            <div className={styles.MusicPerformanceHeader}>
                {/* An exercise generator or a button */}
                {this.getExerciseGeneratorOrButton()}

                {/* A button to switch to the practice view */}
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value="practice"
                    title="Practice Music"
                    backgroundColor={rectButtonColorOptions.GREEN}
                    onClick={this.props.switchToPractice}
                />
            </div>
        );
    }
}

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

export default withRouter(MusicPerformanceHeader);
