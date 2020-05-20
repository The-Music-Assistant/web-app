// NPM module imports
import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useContext,
} from "react";
import PropTypes from "prop-types";
import shortid from "shortid";

// Component imports
import PageHeader from "../PageHeader/PageHeader";
import MusicCard from "./MusicCard/MusicCard";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// Context imports
import GlobalContext from "../../App/GlobalContext";

// File imports
import { getSheetMusic } from "../../vendors/AWS/tmaApi";
import { musicSelectionError } from "../../vendors/Firebase/logs";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import * as cardColorOptions from "./MusicCard/musicCardColorOptions";

// Style imports
import styles from "./MusicSelection.module.scss";

/**
 * Renders the MusicSelection component
 * @component
 * @category MusicSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MusicSelection = ({
    choirId,
    choirName,
    onViewSongClick,
    onViewPerformanceClick,
}) => {
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
     * Global context
     * @type {object}
     * @property {function} showAlert - Shows an alert
     */
    const { showAlert } = useContext(GlobalContext);

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    let isMounted = useRef(false);

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
                        onViewSongClick(musicPiece.sheet_music_id)
                    }
                    onViewPerformanceClick={() =>
                        onViewPerformanceClick(musicPiece.sheet_music_id)
                    }
                />
            );
        });
    };

    /**
     * Gets the main component (loading or music cards)
     * @returns JSX
     */
    const getComponent = () => {
        if (isLoading) {
            // Display a loading spinner
            return <LoadingContainer message="Loading music..." />;
        } else {
            // Display the music cards
            return (
                <div className={styles.musicSelectionCards}>
                    {getMusicCards()}
                </div>
            );
        }
    };

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
            {getComponent()}
        </main>
    );
};

// Prop types for the MusicSelection component
MusicSelection.propTypes = {
    /**
     * The current choir id
     */
    choirId: PropTypes.string.isRequired,

    /**
     * The current choir name
     */
    choirName: PropTypes.string.isRequired,

    /**
     * Click handler for viewing a song
     */
    onViewSongClick: PropTypes.func.isRequired,

    /**
     * Click Handler for viewing a performance
     */
    onViewPerformanceClick: PropTypes.func.isRequired,
};

export default MusicSelection;
