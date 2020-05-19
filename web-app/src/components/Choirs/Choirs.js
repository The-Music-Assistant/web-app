// NPM Module imports
import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";

// Component imports
import ChoirSelection from "../ChoirSelection/ChoirSelection";
import ChoirMembers from "../ChoirMembers/ChoirMembers";

/**
 * Renders the Choirs component.
 * This is the container for the choirs tab.
 * @component
 * @category Choirs
 * @author Dan Levy <danlevy124@gmail.com>
 */

const Choirs = ({ showAlert }) => {
    /**
     * react-router-dom history
     * @type {object}
     */
    const history = useHistory();

    /**
     * react-router-dom match
     * @type {object}
     */
    const match = useRouteMatch();

    const selectedChoir = useRef({
        id: "",
        name: "",
    });

    /**
     * Updates the selected choir data
     * Routes to the ChoirMembers component
     * @param {string} id - The selected choir id
     * @param {string} name - The selected choir name
     */
    const choirClickedHandler = (id, name) => {
        selectedChoir.current = { id, name };

        history.push(`${match.url}/${id}`);
    };

    // Renders the Choirs component
    return (
        <Switch>
            {/* Shows the choir members component */}
            <Route path={`${match.url}/:choirId`}>
                <ChoirMembers
                    choirId={selectedChoir.current.id}
                    choirName={selectedChoir.current.name}
                    showAlert={showAlert}
                />
            </Route>

            {/* Shows the choir selection component */}
            <Route path={`${match.url}`}>
                <ChoirSelection
                    showAlert={showAlert}
                    onChoirClick={choirClickedHandler}
                />
            </Route>
        </Switch>
    );
};

Choirs.propTypes = {
    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,
};

export default Choirs;
