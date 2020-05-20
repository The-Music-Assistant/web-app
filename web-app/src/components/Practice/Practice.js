// NPM Module imports
import React, { useRef, useContext } from "react";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

// Component imports
import ChoirSelection from "../ChoirSelection/ChoirSelection";
import MusicSelection from "../MusicSelection/MusicSelection";
import Music from "../Music/Music";

// Context imports
import GlobalContext from "../../App/GlobalContext";

// File imports
import * as alertBarTypes from "../AlertBar/alertBarTypes";

/**
 * Renders the Practice component.
 * This is the container for the practice tab.
 * @component
 * @category Practice
 * @author Dan Levy <danlevy124@gmail.com>
 */

const Practice = () => {
    /**
     * react-router-dom history
     * @type {object}
     */
    const history = useHistory();

    /**
     * react-router-dom location
     * @type {object}
     */
    const match = useRouteMatch();

    /**
     * Global context
     * @type {object}
     * @property {function} showAlert - Shows an alert
     */
    const { showAlert } = useContext(GlobalContext);

    /**
     * Determines if the browser is mobile or not.
     * Mobile device check includes:
     * iPhone,
     * iPod,
     * iPad (pre-iPad OS),
     * Android,
     * WebOS (Palm phone),
     * BlackBerry, and
     * Windows Phone.
     * @returns {boolean} True is the browser is a mobile browser; false otherwise
     */
    const isMobileBrowser = () => {
        const userAgent = navigator.userAgent;
        return userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i) ||
            userAgent.match(/iPad/i) ||
            userAgent.match(/Android/i) ||
            userAgent.match(/webOS/i) ||
            userAgent.match(/BlackBerry/i) ||
            userAgent.match(/Windows Phone/i)
            ? true
            : false;
    };

    /**
     * The selected choir.
     * This is based on the choir that the user selects.
     * @type {object}
     * @property {string} id - The choir ID
     * @property {string} name - The choir name
     */
    const selectedChoir = useRef({
        id: "",
        name: "",
    });

    /**
     * The selected sheet music.
     * This is based on the piece of music that the user selects.
     * @type {object}
     * @property {string} id - The sheet music id
     */
    const selectedMusic = useRef({
        id: "",
    });

    /**
     * Updates the selected choir data.
     * Routes to the MusicSelection component.
     * @param {string} id - The selected choir id
     * @param {string} name - The selected choir name
     */
    const choirClickedHandler = (id, name) => {
        selectedChoir.current = { id, name };

        history.push(`${match.url}/choirs/${id}`);
    };

    /**
     * Updates the selected music data.
     * Routes to the Music component.
     * The route tells the Music component to display the practice page.
     * @param {string} id - The selected music id
     */
    const viewSongClickedHandler = (id) => {
        selectedMusic.current = { id };

        if (isMobileBrowser()) {
            showMobileBrowserAlert();
        } else {
            history.push(
                `${match.url}/choirs/${selectedChoir.current.id}/music/${id}/practice`
            );
        }
    };

    /**
     * Updates the selected music data.
     * Routes to the Music component.
     * The route tells the Music component to display the performance page.
     * @param {string} id - The selected music id
     */
    const viewPerformanceClickedHandler = (id) => {
        selectedMusic.current = { id };

        if (isMobileBrowser()) {
            showMobileBrowserAlert();
        } else {
            history.push(
                `${match.url}/choirs/${selectedChoir.current.id}/music/${id}/performance`
            );
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

    // Renders the Practice component
    return (
        <Switch>
            {/* Shows the music component */}
            <Route path={`${match.url}/choirs/:choirId/music/:musicId`}>
                <Music sheetMusicId={selectedMusic.current.id} />
            </Route>

            {/* Shows the music selection component */}
            <Route path={`${match.url}/choirs/:choirId`}>
                <MusicSelection
                    choirId={selectedChoir.current.id}
                    choirName={selectedChoir.current.name}
                    onViewSongClick={viewSongClickedHandler}
                    onViewPerformanceClick={viewPerformanceClickedHandler}
                />
            </Route>

            {/* Shows the choir selection component */}
            <Route path={`${match.url}`}>
                <ChoirSelection onChoirClick={choirClickedHandler} />
            </Route>
        </Switch>
    );
};

export default Practice;
