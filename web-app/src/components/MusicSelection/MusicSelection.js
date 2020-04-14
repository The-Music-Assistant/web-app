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
import * as cardColorOptions from "./MusicCard/musicCardColorOptions";

// Style imports
import styles from "./MusicSelection.module.scss";

/**
 * Renders the MusicSelection component
 * @extends {Component}
 * @component
 * @category MusicSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
class MusicSelection extends Component {
    /**
     * MusicSelection component state
     * @property {boolean} isLoading - Indicates if the component is in a loading state
     * @property {array} musicList - An array of sheet music associated with the selected choir
     */
    state = {
        isLoading: true,
        musicList: null,
    };

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    _isMounted = false;

    /**
     * Sets _isMounted to true
     * Gets the list of music
     */
    componentDidMount() {
        this._isMounted = true;
        this.getMusicList();
    }

    /**
     * Sets _isMounted to false
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Gets the list of music associated with the selected choir.
     * Updates state with the music list.
     * @function
     */
    getMusicList = () => {
        // Starts loading
        if (this._isMounted) this.setState({ isLoading: true });

        // Gets the list of music
        getSheetMusic({ choirId: this.props.choirId })
            .then((snapshot) => {
                // Updates state with the music list
                if (this._isMounted)
                    this.setState({
                        isLoading: false,
                        musicList: snapshot.data.sheet_music,
                    });
            })
            .catch((error) => {
                // Logs an error
                musicSelectionError(
                    error.response.status,
                    error.response.data,
                    "[MusicSelection/getMusicList]"
                );

                // Shows an error alert
                this.props.showAlert(
                    alertBarTypes.ERROR,
                    "Error",
                    error.response.data
                );

                // Updates state
                if (this._isMounted) this.setState({ isLoading: false });
            });
    };

    /**
     * If the browser is not a mobile browser,
     * (1) Updates Redux with the selected piece of music, and
     * (2) Routes to the practice music page
     * @param {string} id - The id of the selected piece of music
     * @function
     */
    viewSongClickedHandler = (id) => {
        if (this.props.isMobileBrowser) {
            // Shows an alert
            this.showMobileBrowserAlert();
        } else {
            // Updates Redux and routes to the correct page
            this.props.musicSelected(id);
            this.props.history.push(
                `${this.props.match.url}/music/${id}/practice`
            );
        }
    };

    /**
     * If the browser is not a mobile browser,
     * (1) Updates Redux with the selected piece of music, and
     * (2) Routes to the music performance page
     * @param {string} id - The id of the selected piece of music
     * @function
     */
    viewPerformanceClickedHandler = (id) => {
        if (this.props.isMobileBrowser) {
            // Shows an alert
            this.showMobileBrowserAlert();
        } else {
            // Updates Redux and routes to the correct page
            this.props.musicSelected(id);
            this.props.history.push(
                `${this.props.match.url}/music/${id}/performance`
            );
        }
    };

    /**
     * Shows an alert indicating that the user cannot access the selected page on a mobile browser
     * @function
     */
    showMobileBrowserAlert = () => {
        this.props.showAlert(
            alertBarTypes.WARNING,
            "We're Sorry",
            "You can't view or play music on this mobile device due to processing limitations"
        );
    };

    /**
     * Gets an array of MusicCard components
     * @function
     * @returns {array} An array of MusicCard components
     */
    getMusicCards = () => {
        // An array of color options
        const colorOptions = Object.values(cardColorOptions);

        // Index starts at -1 because it is incremented before its first use
        let colorIndex = -1;

        // Returns an array of MusicCard components
        return this.state.musicList.map((musicPiece) => {
            // Gets the next color
            colorIndex++;

            // >= is tested instead of > because colorIndex is incremented before this check
            if (colorIndex >= colorOptions.length) {
                // Start back at the beginning of the colorOptions array
                colorIndex = 0;
            }

            // Returns a MusicCard to the map function
            return (
                <MusicCard
                    key={shortid.generate()}
                    title={musicPiece.title}
                    composers={musicPiece.composer_names}
                    cardColor={colorOptions[colorIndex]}
                    onViewSongClick={() =>
                        this.viewSongClickedHandler(musicPiece.sheet_music_id)
                    }
                    onViewPerformanceClick={() =>
                        this.viewPerformanceClickedHandler(
                            musicPiece.sheet_music_id
                        )
                    }
                />
            );
        });
    };

    /**
     * Renders the MusicSelection component
     */
    render() {
        // The component to display (loading or cards)
        let component;

        if (this.state.isLoading) {
            // Display a loading spinner
            component = <LoadingContainer message="Loading music..." />;
        } else {
            // Display the music cards
            component = (
                <div className={styles.musicSelectionCards}>
                    {this.getMusicCards()}
                </div>
            );
        }

        // Returns the JSX to render
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

// Prop types for the MusicSelection component
MusicSelection.propTypes = {
    /**
     * The id of the selected choir
     */
    choirId: PropTypes.string.isRequired,

    /**
     * The name of the selected choir
     */
    choirName: PropTypes.string.isRequired,

    /**
     * Indicates if the browser is a mobile browser
     */
    isMobileBrowser: PropTypes.bool.isRequired,

    /**
     * React Router history object.
     * This is provided by the withRouter function.
     */
    history: PropTypes.object.isRequired,

    /**
     * React Router match object.
     * This is provided by the withRouter function.
     */
    match: PropTypes.object.isRequired,

    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,

    /**
     * Updates Redux with music data
     */
    musicSelected: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the MusicSelection component as props.
 * This function is used only by the react-redux connect function.
 * @memberof MusicSelection
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the MusicSelection component
 */
const mapStateToProps = (state) => {
    return {
        choirId: state.practice.selectedChoirId,
        choirName: state.practice.selectedChoirName,
        isMobileBrowser: state.app.isMobileBrowser,
    };
};

/**
 * Passes certain Redux actions to the MusicSelection component as props.
 * This function is used only by the react-redux connect function.
 * @memberof MusicSelection
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the MusicSelection component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        musicSelected: (id) => dispatch(musicSelectedForPractice(id)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(MusicSelection)
);
