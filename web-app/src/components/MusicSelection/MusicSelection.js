// ----------------------------------------------------------------------------
// File Path: src/components/MusicSelection/MusicSelection.js
// Description: Renders the music selection component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/26/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import shortid from "shortid";

// Component imports
import PageHeader from "../PageHeader/PageHeader";
import MusicCard from "./MusicCard/MusicCard";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// File imports
import { getSheetMusic } from "../../vendors/AWS/tmaApi";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import { musicSelectionError } from "../../vendors/Firebase/logs";
import { musicSelectedForPractice } from "../../store/actions";

// Style imports
import styles from "./MusicSelection.module.scss";

class MusicSelection extends Component {
    // Component state
    state = {
        isLoading: true,
        music: null,
    };

    // Indicates whether the component is mounted or not
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.getMusicList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getMusicList = () => {
        // Starts loading
        if (this._isMounted) this.setState({ isLoading: true });

        // Gets music
        getSheetMusic({ choirId: this.props.choirId })
            .then((snapshot) => {
                if (this._isMounted)
                    this.setState({
                        isLoading: false,
                        music: snapshot.data.sheet_music,
                    });
            })
            .catch((error) => {
                musicSelectionError(
                    error.response.status,
                    error.response.data,
                    "[MusicSelection/getMusicList]"
                );
                this.props.showAlert(
                    alertBarTypes.ERROR,
                    "Error",
                    error.response.data
                );
                if (this._isMounted) this.setState({ isLoading: false });
            });
    };

    viewSongClickedHandler = (id) => {
        if (this.props.isMobileBrowser) {
            this.showMobileBrowserAlert();
        } else {
            this.props.musicSelected(id);
            this.props.history.push(
                `${this.props.match.url}/music/${id}/practice`
            );
        }
    };

    viewPerformanceClickedHandler = (id) => {
        if (this.props.isMobileBrowser) {
            this.showMobileBrowserAlert();
        } else {
            this.props.musicSelected(id);
            this.props.history.push(
                `${this.props.match.url}/music/${id}/performance`
            );
        }
    };

    showMobileBrowserAlert = () => {
        this.props.showAlert(
            alertBarTypes.WARNING,
            "We're Sorry",
            "You can't view or play music on this mobile device due to processing limitations"
        );
    };

    createSheetMusicComponents = () => {
        // Card color options
        const colors = [
            "secondaryBlue",
            "green",
            "primaryBlue",
            "orange",
            "tertiaryBlue",
            "red",
        ];

        // Index starts at -1 because it is incremented before its first use
        let colorIndex = -1;

        // The cards to return
        return this.state.music.map((musicPiece) => {
            // Gets the next color
            colorIndex++;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
            }

            return (
                <MusicCard
                    key={shortid.generate()}
                    title={musicPiece.title}
                    composers={musicPiece.composer_names}
                    cardColor={colors[colorIndex]}
                    viewSongClicked={() =>
                        this.viewSongClickedHandler(musicPiece.sheet_music_id)
                    }
                    viewExercisesClicked={() =>
                        this.viewPerformanceClickedHandler(
                            musicPiece.sheet_music_id
                        )
                    }
                />
            );
        });
    };

    render() {
        // The component to display
        let component;

        if (this.state.isLoading) {
            // Display a loading spinner
            component = <LoadingContainer message="Loading music..." />;
        } else {
            // Display the music cards
            component = (
                <div className={styles.musicSelectionCards}>
                    {this.createSheetMusicComponents()}
                </div>
            );
        }
        return (
            <div className={styles.musicSelection}>
                <PageHeader
                    heading={`${this.props.choirName} - Music`}
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Choir Selection"}
                />
                {component}
            </div>
        );
    }
}

// Prop types for the MusicControls component
MusicSelection.propTypes = {
    choirId: PropTypes.string.isRequired,
    choirName: PropTypes.string.isRequired,
    showAlert: PropTypes.func.isRequired,
    musicSelected: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes it to the MusicSelection component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = (state) => {
    return {
        choirId: state.practice.selectedChoirId,
        choirName: state.practice.selectedChoirName,
        isMobileBrowser: state.app.isMobileBrowser,
    };
};

/**
 * Passes certain redux actions to MusicSelection
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = (dispatch) => {
    return {
        musicSelected: (id) => dispatch(musicSelectedForPractice(id)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MusicSelection)
);
