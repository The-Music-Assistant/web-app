// ----------------------------------------------------------------------------
// File Path: src/components/Music/Music.js
// Description: Renders the Music component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import {withRouter} from "react-router-dom";

// Component imports
import MusicHeader from "./PracticeMusicHeader/PracticeMusicHeader";
import PageHeader from "../PageHeader/PageHeader";

// File imports
import initializeAPI from "../../vendors/AlphaTab/initialization";
import destroyAlphaTabApi from "../../vendors/AlphaTab/destruction";
import { changeToSheetMusic, changePart } from "../../vendors/AlphaTab/actions";
import { getMyPart, getPartList } from "../../vendors/AlphaTab/actions";

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
        initializeAPI();
        changeToSheetMusic()
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

    componentWillUnmount() {
        // TODO: Use Redux to wait for api to be destroyed
        destroyAlphaTabApi(); // This is a promise
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
        // Returns the JSX to display
        return (
            <main className={styles.music}>
                <PageHeader
                    heading="Practice"
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Music Selection"}
                    backButtonClickedHandler={this.backButtonClickedHandler}
                />
                {!this.state.isLoading ? (
                    <MusicHeader
                        currentPart={this.state.currentPart}
                        partList={this.state.partList}
                        onPartChange={this.onPartChangeHandler}
                    />
                ) : null}
                <section id='alpha-tab-wrapper'>
                    <div id='sketch-holder'></div>
                    <div id='alpha-tab-container'></div>
                </section>
            </main>
        );
    }
}

export default withRouter(Music);
