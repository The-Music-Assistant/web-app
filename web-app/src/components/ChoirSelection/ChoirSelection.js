// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import shortid from "shortid";

// Component imports
import ChoirCard from "./ChoirCards/ChoirCard/ChoirCard";
import ChoirOptionCard from "./ChoirCards/ChoirOptionCard/ChoirOptionCard";
import PageHeader from "../PageHeader/PageHeader";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// Image imports
import plusIcon from "../../assets/icons/plus-icon.svg";
import questionIcon from "../../assets/icons/question-icon.svg";

// File imports
import { choirSelectionError } from "../../vendors/Firebase/logs";
import { getUsersChoirs, joinChoir } from "../../vendors/AWS/tmaApi";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import {
    choirSelectedForPractice,
    choirSelectedForChoirs,
} from "../../store/actions/index";
import * as routingOptions from "./choirSelectionRoutingOptions";
import * as cardColorOptions from "./ChoirCards/choirCardColorOptions";

// Style imports
import styles from "./ChoirSelection.module.scss";

/**
 * Renders the choir selection component
 * Shows a card for each choir, as well as card(s) for choir option(s).
 * @extends {Component}
 * @component
 * @category ChoirSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
class ChoirSelection extends Component {
    /**
     * ChoirSelection component state
     * @property {boolean} isLoading - Indicates if the component is in a loading state
     * @property {array} choirs - An array of choirs that the user is a member of
     */
    state = {
        isLoading: true,
        choirs: null,
    };

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     */
    _isMounted = false;

    /**
     * Sets _isMounted to true.
     * Gets the list of choirs.
     */
    componentDidMount() {
        this._isMounted = true;
        this.getChoirList();
    }

    /**
     * Sets _isMounted to false
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Gets the list of choirs that the user is a member of
     * @function
     */
    getChoirList() {
        // Updates state
        if (this._isMounted) this.setState({ isLoading: true });

        // Gets the choir list
        getUsersChoirs()
            .then((snapshot) => {
                // Updates state
                if (this._isMounted)
                    this.setState({
                        choirs: snapshot.data.choirs,
                        isLoading: false,
                    });
            })
            .catch((error) => {
                // Logs an error
                choirSelectionError(
                    error.response.status,
                    error.response.data,
                    "[ChoirSelection/getChoirList]"
                );

                // Shows an alert
                this.props.showAlert(
                    alertBarTypes.ERROR,
                    "Error",
                    error.response.data
                );

                // Updates state
                if (this._isMounted) this.setState({ isLoading: false });
            });
    }

    /**
     * Updates Redux with the selected choir id and choir name
     * Routes to the new url
     * @param {string} id - The selected choir id
     * @param {string} name - The selected choir name
     */
    choirClickedHandler = (id, name) => {
        let routeUrl; // The url to route to

        // Calls the correct dispatch function and sets the routeUrl depending on the routing prop value
        switch (this.props.routing) {
            case routingOptions.MUSIC_SELECTION:
                this.props.choirSelectedForPractice(id, name);
                routeUrl = `${this.props.match.url}/choirs/${id}`;
                break;
            case routingOptions.CHOIR_MEMBERS:
                this.props.choirSelectedForChoirs(id, name);
                routeUrl = `${this.props.match.url}/${id}`;
                break;
            default:
                console.log(
                    "Invalid routing option was given. See choirSelectionRoutingOptions.js"
                );
        }

        // Routes to the new url
        this.props.history.push(routeUrl);
    };

    /**
     * Attempts to join a new choir
     * @function
     */
    newChoirClickHandler = () => {
        // Asks the user to enter an access code
        const accessCode = prompt("Please enter the access code given to you");

        if (accessCode) {
            // Adds user to the list of pending members for the choir
            // An admin for the choir must verfiy this user before this user can access the choir
            joinChoir({ memberType: "student", memberRole: "x", accessCode })
                .then(() => {
                    // Show a success alert
                    this.props.showAlert(
                        alertBarTypes.SUCCESS,
                        "Hang Tight",
                        "Your request to join the choir has been sent. Please wait for a choir administrator to confirm your request."
                    );
                })
                .catch((error) => {
                    // Logs the error
                    choirSelectionError(
                        error.response.status,
                        error.response.data,
                        "[ChoirSelection/newChoirClickHandler]"
                    );

                    // Shows an alert
                    this.props.showAlert(
                        alertBarTypes.ERROR,
                        "Error",
                        error.response.data
                    );
                });
        }
    };

    // TODO: Add this functionality
    viewPendingRequestsClickHandler = () => {};

    /**
     * Creates a ChoirCard component for each choir.
     * Also creates a ChoirOptionCard for each choir option.
     * @returns - An array of choir card components
     */
    getChoirComponents = () => {
        const cards = this.getChoirCards();

        // Adds a card for adding a new choir
        cards.push(
            <ChoirOptionCard
                key={shortid.generate()}
                iconSrc={plusIcon}
                name="New Choir"
                cardColor={cardColorOptions.ORANGE}
                onClick={this.newChoirClickHandler}
            />
        );

        // Adds a card for viewing pending choir requests
        cards.push(
            <ChoirOptionCard
                key={shortid.generate()}
                iconSrc={questionIcon}
                name="View Pending Choir Requests"
                cardColor={cardColorOptions.TERTIARY_BLUE}
                onClick={this.viewPendingRequestsClickHandler}
            />
        );

        // Returns the array of choir cards
        return cards;
    };

    /**
     * Gets an array of ChoirCard components
     * @function
     * @returns {array} An array of ChoirCard components
     */
    getChoirCards = () => {
        // An array of color options
        const colorOptions = Object.values(cardColorOptions);

        // Index starts at -1 because it is incremented before its first use
        let colorIndex = -1;

        // The cards to return
        let cards = [];

        // Maps the choirs to cards
        if (this.state.choirs) {
            cards = this.state.choirs.map((choir) => {
                // Gets the next color
                colorIndex++;

                // >= is tested instead of > because colorIndex is incremented before this check
                if (colorIndex >= colorOptions.length) {
                    // Start back at the beginning of the colorOptions array
                    colorIndex = 0;
                }

                // Returns a ChoirCard to the map function
                return (
                    <ChoirCard
                        key={shortid.generate()}
                        headerImgSrc={choir.picture_url}
                        name={choir.choir_name}
                        description={choir.description}
                        cardColor={colorOptions[colorIndex]}
                        onClick={() =>
                            this.choirClickedHandler(
                                choir.choir_id,
                                choir.choir_name
                            )
                        }
                    />
                );
            });
        }

        return cards;
    };

    /**
     * Renders the ChoirSelection component
     */
    render() {
        // The component to display (loading or cards)
        let component;

        if (this.state.isLoading) {
            // Display a loading spinner
            component = <LoadingContainer message="Loading choirs..." />;
        } else {
            // Display the choir cards
            component = (
                <div className={styles.choirSelectionCards}>
                    {this.getChoirComponents()}
                </div>
            );
        }

        // Returns the JSX to render
        return (
            <div className={styles.choirSelection}>
                <PageHeader
                    heading="Choir Selection"
                    shouldDisplayBackButton={false}
                />
                {component}
            </div>
        );
    }
}

// Prop types for the ChoirSelection component
ChoirSelection.propTypes = {
    /**
     * Where to route when a choir card is clicked on.
     * see [options]{@link module:choirSelectionRoutingOptions}.
     */
    routing: PropTypes.oneOf([
        routingOptions.MUSIC_SELECTION,
        routingOptions.CHOIR_MEMBERS,
    ]).isRequired,

    /**
     * React Router history object.
     * This is provided by the withRouter function.
     */
    history: PropTypes.object.isRequired,

    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,

    /**
     * Updates Redux with choir data.
     * Used when selecting a choir to practice for.
     */
    choirSelectedForPractice: PropTypes.func.isRequired,

    /**
     * Updates Redux with choir data.
     * Used when selecting a choir to view members of.
     */
    choirSelectedForChoirs: PropTypes.func.isRequired,
};

/**
 * Passes certain Redux actions to the ChoirSelection component as props.
 * This function is used only by the react-redux connect function.
 * @memberof ChoirSelection
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the ChoirSelection component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        choirSelectedForPractice: (id, name) =>
            dispatch(choirSelectedForPractice(id, name)),
        choirSelectedForChoirs: (id, name) =>
            dispatch(choirSelectedForChoirs(id, name)),
    };
};

export default withRouter(connect(null, mapDispatchToProps)(ChoirSelection));
