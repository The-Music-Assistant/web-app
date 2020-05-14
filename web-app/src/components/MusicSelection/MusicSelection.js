// NPM module imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import shortid from "shortid";

// Component imports
import PageHeader from "../PageHeader/PageHeader";
import MusicCard from "./MusicCard/MusicCard";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// File imports
import { getSheetMusic } from "../../vendors/AWS/tmaApi";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import { musicSelectionError } from "../../vendors/Firebase/logs";
import { musicSelectedForPractice } from "../../store/actions/index";
import * as cardColorOptions from "./MusicCard/musicCardColorOptions";

// Style imports
import styles from "./MusicSelection.module.scss";

/**
 * Renders the MusicSelection component
 * @component
 * @category MusicSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MusicSelection = ({ showAlert }) => {
    /**
     * Indicates if the component is in a loading state
     * {[isLoading, setIsLoading]: [boolean, function]}
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * An array of sheet music associated with the selected choir
     * {[musicList, setMusicList]: [array, function]}
     */
    const [musicList, setMusicList] = useState([]);

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    let isMounted = useRef(false);

    /**
     * react-redux dispatch function
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * The id of the selected choir
     */
    const choirId = useSelector((state) => state.practice.selectedChoirId);

    /**
     * The name of the selected choir
     */
    const choirName = useSelector((state) => state.practice.selectedChoirName);

    /**
     * Indicates if the browser is a mobile browser
     */
    const isMobileBrowser = useSelector((state) => state.app.isMobileBrowser);

    /**
     * react-router-dom history
     * @type {object}
     */
    const history = useHistory();

    /**
     * react-router-dom route match
     * @type {object}
     */
    const match = useRouteMatch();

    /**
     * Gets the list of music associated with the selected choir.
     * Updates state with the music list.
     */
    const getMusicList = useCallback(() => {
        // Starts loading
        if (isMounted.current) setIsLoading(true);

        // Gets the list of music
        getSheetMusic({ choirId: choirId })
            .then((snapshot) => {
                // Updates state with the music list
                if (isMounted.current) setMusicList(snapshot.data.sheet_music);
            })
            .then(() => {
                if (isMounted.current) setIsLoading(false);
            })
            .catch((error) => {
                // Logs an error
                musicSelectionError(
                    error.response.status,
                    error.response.data,
                    "[MusicSelection/getMusicList]"
                );

                // Shows an error alert
                showAlert(alertBarTypes.ERROR, "Error", error.response.data);

                // Updates state
                if (isMounted.current) setIsLoading(false);
            });
    }, [choirId, showAlert]);

    /**
     * Sets isMounted to true
     * Gets the list of music
     * @returns {function} A cleanup function that sets isMounted to false
     */
    useEffect(() => {
        isMounted.current = true;
        getMusicList();

        return () => {
            isMounted.current = false;
        };
    }, [getMusicList]);

    /**
     * If the browser is not a mobile browser,
     * (1) Updates Redux with the selected piece of music, and
     * (2) Routes to the practice music page
     * @param {string} id - The id of the selected piece of music
     */
    const viewSongClickedHandler = (id) => {
        if (isMobileBrowser) {
            // Shows an alert
            showMobileBrowserAlert();
        } else {
            // Updates Redux and routes to the correct page
            dispatch(musicSelectedForPractice(id));
            history.push(`${match.url}/music/${id}/practice`);
        }
    };

    /**
     * If the browser is not a mobile browser,
     * (1) Updates Redux with the selected piece of music, and
     * (2) Routes to the music performance page
     * @param {string} id - The id of the selected piece of music
     */
    const viewPerformanceClickedHandler = (id) => {
        if (isMobileBrowser) {
            // Shows an alert
            showMobileBrowserAlert();
        } else {
            // Updates Redux and routes to the correct page
            dispatch(musicSelectedForPractice(id));
            history.push(`${match.url}/music/${id}/performance`);
        }
    };

    /**
     * Shows an alert indicating that the user cannot access the selected page on a mobile browser
     */
    const showMobileBrowserAlert = () => {
        showAlert(
            alertBarTypes.WARNING,
            "We're Sorry",
            "You can't view or play music on this mobile device due to processing limitations"
        );
    };

    /**
     * Gets an array of MusicCard components
     * @returns {array} An array of MusicCard components
     */
    const getMusicCards = () => {
        // An array of color options
        const colorOptions = Object.values(cardColorOptions);

        // Index starts at -1 because it is incremented before its first use
        let colorIndex = -1;

        // Returns an array of MusicCard components
        return musicList.map((musicPiece) => {
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
                        viewSongClickedHandler(musicPiece.sheet_music_id)
                    }
                    onViewPerformanceClick={() =>
                        viewPerformanceClickedHandler(musicPiece.sheet_music_id)
                    }
                />
            );
        });
    };

    // The component to display (loading component or cards component)
    let loadingOrCardsComponent;

    if (isLoading) {
        // Display a loading spinner
        loadingOrCardsComponent = (
            <LoadingContainer message="Loading music..." />
        );
    } else {
        // Display the music cards
        loadingOrCardsComponent = (
            <div className={styles.musicSelectionCards}>{getMusicCards()}</div>
        );
    }

    // Renders the MusicSelection component
    return (
        <main className={styles.musicSelection}>
            {/* Page header */}
            <PageHeader
                heading={`${choirName} - Music`}
                shouldDisplayBackButton={true}
                backButtonTitle={"Choir Selection"}
            />

            {/* Main component */}
            {loadingOrCardsComponent}
        </main>
    );
};

// Prop types for the MusicSelection component
MusicSelection.propTypes = {
    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,
};

export default MusicSelection;
