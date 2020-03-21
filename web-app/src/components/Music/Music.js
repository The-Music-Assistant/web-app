// ----------------------------------------------------------------------------
// File Path: src/components/Music/Music.js
// Description: Renders the Music component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// Component imports
import MusicHeader from "./PracticeMusicHeader/PracticeMusicHeader";
import PageHeader from "../PageHeader/PageHeader";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// File imports
import initializeAlphaTabApi from "../../vendors/AlphaTab/initialization";
import destroyAlphaTabApi from "../../vendors/AlphaTab/destruction";
import alphaTabVars from "../../vendors/AlphaTab/variables";
import { changeToSheetMusic, changePart } from "../../vendors/AlphaTab/actions";
import { getMyPart, getPartList } from "../../vendors/AlphaTab/actions";
import setupPitchDetection from "../../vendors/ML5/PitchDetection/initialization";
import { sheetMusicError } from "../../vendors/Firebase/logs";

// Style imports
import "./SheetMusic.scss";
import styles from "./Music.module.scss";

class Music extends Component {
    // Component state
    state = {
        isLoading: true,
        currentPart: null,
        partList: null
    };

    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    componentDidMount() {
        // Initializes the AlphaTab API and displays the music
        this.prepareMusic()
            .then(() => {
                this.setState({
                    isLoading: false,
                    currentPart: getMyPart(),
                    partList: getPartList()
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    /**
     * Initializes AlphaTab
     * Initializes pitch detection
     * Gets the piece of sheet music
     * Renders AlphaTab
     * @returns - A promise
     */
    prepareMusic = async () => {
        initializeAlphaTabApi();
        return Promise.all([
            this.initializePitchDetection(),
            changeToSheetMusic(),
            this.waitForAlphaTabToRender()
        ]);
    };

    /**
     * Sets up ML5 pitch detection
     */
    initializePitchDetection = async () => {
        // Prepares for microphone input sets up the pitch detection model
        try {
            await setupPitchDetection();
        } catch (error) {
            // TODO: Add overlay that notifies user that the microphone is not available
            sheetMusicError(null, error, "[vendors/AlphaTab/listeners/onFirstRender]");
        }
    };

    /**
     * Waits for AlphaTab to render
     */
    waitForAlphaTabToRender = () => {
        return new Promise(resolve => {
            alphaTabVars.api.addPostRenderFinished(resolve);
        });
    };

    /**
     * Destroys the AlphaTab API
     * Removes the P5 drawer
     * Stops pitch detection
     */
    componentWillUnmount() {
        destroyAlphaTabApi();
    }

    /**
     * Destroys the AlphaTab API before going back a page
     */
    backButtonClickedHandler = () => {
        this.props.history.goBack();
    };

    /**
     * Changes the track number on AlphaTab to the new partIndex
     * Updates state to reflect the new part value
     * @param index - The index of the selected part based on the original array
     * @param value - The value (name) of the selected part
     */
    onPartChangeHandler = (index, value) => {
        changePart(`t${index}`);
        this.setState({ currentPart: value });
    };

    /**
     * Renders the PracticeSheetMusic component
     * The sketch and AlphaTex are not displayed via React, but via direct DOM manipulation
     */
    render() {
        let component;
        let atWrapperClassName;

        if (this.state.isLoading) {
            component = <LoadingContainer message='Loading music...' />;
            atWrapperClassName = styles.hide;
        } else {
            component = (
                <MusicHeader
                    currentPart={this.state.currentPart}
                    partList={this.state.partList}
                    onPartChange={this.onPartChangeHandler}
                />
            );
            atWrapperClassName = styles.show;
        }

        // Returns the JSX to display
        return (
            <main className={styles.music}>
                <PageHeader
                    heading='Practice'
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Music Selection"}
                    backButtonClickedHandler={this.backButtonClickedHandler}
                />
                {component}
                <section className={atWrapperClassName} id='alpha-tab-wrapper'>
                    <div id='sketch-holder'></div>
                    <div id='alpha-tab-container'></div>
                </section>
            </main>
        );
    }
}

export default withRouter(Music);
