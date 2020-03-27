// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/MusicPerformancesHeader/MusicPerformancesHeader.js
// Description: Renders the MusicPerformancesHeader component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/25/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
// import PropTypes from "prop-types";

// Component imports
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import ExerciseGenerator from "./ExerciseGenerator/ExerciseGenerator";

// File imports
import * as rectButtonColorOptions from "../../Buttons/RectangularButton/rectangularButtonColorOptions";
import * as buttonTypes from "../../Buttons/buttonTypes";

// Style imports
import styles from "./MusicPerformancesHeader.module.scss";

class MusicPerformancesHeader extends Component {
    // Component state
    state = {
        // TODO: Change to false
        shouldDisplayExerciseGeneration: true
    };

    /**
     * Updates state to trigger the exercise generation component to display
     */
    showExerciseGenerationButtonClickedHandler = () => {
        this.setState({ shouldDisplayExerciseGeneration: true });
    };

    /**
     * Updates state to trigger the exercise generation component to hide
     */
    hideExerciseGenerationHandler = () => {
        this.setState({ shouldDisplayExerciseGeneration: false });
    };

    practiceMusicButtonClickedHandler = () => {};

    render() {
        let exerciseGenerationComponent;
        if (this.state.shouldDisplayExerciseGeneration) {
            exerciseGenerationComponent = (
                <ExerciseGenerator onGenerateExerciseClose={this.hideExerciseGenerationHandler} />
            );
        } else {
            exerciseGenerationComponent = (
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value='create-exercise-generation'
                    text='Create an Exercise'
                    backgroundColor={rectButtonColorOptions.ORANGE}
                    onClick={this.showExerciseGenerationButtonClickedHandler}
                />
            );
        }

        return (
            <div className={styles.musicPerformancesHeader}>
                {exerciseGenerationComponent}
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value='practice'
                    text='Practice Music'
                    backgroundColor={rectButtonColorOptions.GREEN}
                    onClick={this.showExerciseGenerationButtonClickedHandler}
                />
            </div>
        );
    }
}

// Prop types for the MusicPerformancesHeader component
// MusicPerformancesHeader.propTypes = {};

export default MusicPerformancesHeader;
