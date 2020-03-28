// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/MusicPerformanceHeader/MusicPerformanceHeader.js
// Description: Renders the MusicPerformanceHeader component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/25/2020
// ----------------------------------------------------------------------------

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

class MusicPerformanceHeader extends Component {
    // Component state
    state = {
        shouldDisplayExerciseGeneration: false
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

    practiceMusicButtonClickedHandler = () => {
        const routeUrl = `${this.props.match.url.substring(
            0,
            this.props.match.url.lastIndexOf("/")
        )}/practice`;

        this.props.history.replace(routeUrl);
    };

    render() {
        let exerciseGenerationComponent;
        if (this.state.shouldDisplayExerciseGeneration) {
            exerciseGenerationComponent = (
                <ExerciseGenerator
                    numberOfMeasures={this.props.numberOfMeasures}
                    onGenerateExerciseClose={this.hideExerciseGenerationHandler}
                />
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
            <div className={styles.MusicPerformanceHeader}>
                {exerciseGenerationComponent}
                <RectangularButton
                    type={buttonTypes.BUTTON}
                    value='practice'
                    text='Practice Music'
                    backgroundColor={rectButtonColorOptions.GREEN}
                    onClick={this.practiceMusicButtonClickedHandler}
                />
            </div>
        );
    }
}

// Prop types for the MusicPerformanceHeader component
MusicPerformanceHeader.propTypes = {
    numberOfMeasures: PropTypes.string.isRequired
};

export default withRouter(MusicPerformanceHeader);
