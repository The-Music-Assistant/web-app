// ----------------------------------------------------------------------------
// File Path: src/components/ChoirSelection/ChoirSelection.js
// Description: Renders the choir selection component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import shortid from "shortid";
import { MetroSpinner } from "react-spinners-kit";

// Component imports
import ChoirCard from "./ChoirCard/ChoirCard";
import SelectInput from "../FormInputs/SelectInput/SelectInput";

// Image imports
import plusIcon from "../../assets/icons/plus-icon.svg";
import questionIcon from "../../assets/icons/question-icon.svg";

// File imports
import * as logs from "../../vendors/Firebase/logs";
import { getUsersChoirs, joinChoir } from "../../vendors/AWS/tmaApi";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import { choirSelectedForPractice, choirSelectedForChoirs } from "../../store/actions";
import * as routingOptions from "./routingOptions";
import * as selectInputColorOptions from "../FormInputs/SelectInput/colorOptions";

// Style imports
import styles from "./ChoirSelection.module.scss";

class ChoirSelection extends Component {
    // Component state
    state = {
        isLoading: true,
        choirs: null,
        minLoadingTimeElapsed: false
    };

    // Indicates whether the component is mounted or not
    _isMounted = false;

    /**
     * Gets the choir list
     */
    componentDidMount() {
        this._isMounted = true;
        this.getChoirList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Gets the list of choirs that the user is a part of
     */
    getChoirList() {
        // Starts loading
        if (this._isMounted) this.setState({ isLoading: true, minLoadingTimeElapsed: false });
        setTimeout(() => {
            if (this._isMounted) this.setState({ minLoadingTimeElapsed: true });
        }, 500);

        // Gets the choir list
        getUsersChoirs()
            .then(snapshot => {
                if (this._isMounted)
                    this.setState({ choirs: snapshot.data.choirs, isLoading: false });
            })
            .catch(error => {
                logs.choirSelectionError(
                    error.response.status,
                    error.response.data,
                    "[ChoirSelection/getChoirList]"
                );
                this.props.showAlert(alertBarTypes.ERROR, "Error", error.response.data);
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
        let routeUrl;

        // Calls the correct dispatch function and sets the routeUrl depending on the routing prop value
        if (this.props.routing === routingOptions.MUSIC_SELECTION) {
            this.props.choirSelectedForPractice(id, name);
            routeUrl = `${this.props.match.url}/choirs/${id}`;
        } else {
            this.props.choirSelectedForChoirs(id, name);
            routeUrl = `${this.props.match.url}/${id}`;
        }

        // Routes to the new url
        this.props.history.push(routeUrl);
    };

    /**
     * Attempts to join a new choir
     */
    newChoirClickHandler = () => {
        // Asks the user to enter an access code
        const accessCode = prompt("Please enter the access code given to you");

        if (accessCode) {
            // Adds user to the list of pending members for the choir
            // An admin for the choir must verfiy this user before this user can access the choir
            joinChoir({ memberType: "student", memberRole: "x", accessCode })
                .then(() => {
                    this.props.showAlert(
                        alertBarTypes.WARNING,
                        "Hang Tight",
                        "Your request to join the choir has been sent. Please wait for a choir administrator to confirm your request."
                    );
                })
                .catch(error => {
                    logs.choirSelectionError(
                        error.response.status,
                        error.response.data,
                        "[ChoirSelection/newChoirClickHandler]"
                    );
                    this.props.showAlert(alertBarTypes.ERROR, "Error", error.response.data);
                });
        }
    };

    viewPendingRequestsClickHandler = () => {};

    /**
     * Creates a choir card for each choir
     * @returns - An array of choir card components
     */
    createChoirComponents = () => {
        // Card color options
        const colors = ["secondaryBlue", "green", "primaryBlue", "orange", "tertiaryBlue", "red"];

        // Index starts at -1 because it is incremented before its first use
        let colorIndex = -1;

        // The cards to return
        let components = [];

        // Maps the choirs to cards if any exist
        if (this.state.choirs) {
            components = this.state.choirs.map(choir => {
                // Gets the next color
                colorIndex++;
                if (colorIndex >= colors.length) {
                    colorIndex = 0;
                }

                // Returns a choir card
                return (
                    <ChoirCard
                        key={shortid.generate()}
                        headerImgSrc={choir.picture_url}
                        name={choir.choir_name}
                        description={choir.description}
                        noDescription={false}
                        cardColor={colors[colorIndex]}
                        onClick={() => this.choirClickedHandler(choir.choir_id, choir.choir_name)}
                    />
                );
            });
        }

        // NOTE: The following two cards appear even if the user is not part of any choir

        // Adds a card for adding a new choir
        components.push(
            <ChoirCard
                key={shortid.generate()}
                headerImgSrc={plusIcon}
                name='New Choir'
                description={null}
                noDescription={true}
                cardColor='orange'
                onClick={this.newChoirClickHandler}
            />
        );

        // Adds a card for viewing pending choir requests
        components.push(
            <ChoirCard
                key={shortid.generate()}
                headerImgSrc={questionIcon}
                name='View Pending Choir Requests'
                description={null}
                noDescription={true}
                cardColor='tertiaryBlue'
                onClick={this.viewPendingRequestsClickHandler}
            />
        );

        // Returns the array of choir cards
        return components;
    };

    /**
     * Returns the JSX to display
     */
    render() {
        // The component to display (loading or cards)
        let component;

        if (this.state.isLoading || !this.state.minLoadingTimeElapsed) {
            // Display a loading spinner
            component = (
                <div className={styles.choirSelectionSpinner}>
                    <MetroSpinner size={75} color='#5F9CD1' loading={true} />
                    <h1 className={styles.choirSelectionSpinnerMessage}>Loading choirs...</h1>
                </div>
            );
        } else {
            // Display the choir cards
            component = (
                <div className={styles.choirSelectionCards}>{this.createChoirComponents()}</div>
            );
        }

        // Returns the JSX to display
        return (
            <div className={styles.choirSelection}>
                <h1 className={styles.choirSelectionHeading}>Choir Selection</h1>
                <SelectInput
                    placeholder='Choose a Part'
                    name='choose-part'
                    color={selectInputColorOptions.ORANGE}
                    options={["Alto Alto Alto Alto", "Soprano", "Tenor", "Base"]}
                />
                {component}
            </div>
        );
    }
}

// Prop types for the ChoirSelection component
ChoirSelection.propTypes = {
    routing: PropTypes.oneOf([routingOptions.MUSIC_SELECTION, routingOptions.CHOIR_MEMBERS])
        .isRequired,
    showAlert: PropTypes.func.isRequired,
    choirSelectedForPractice: PropTypes.func.isRequired,
    choirSelectedForChoirs: PropTypes.func.isRequired
};

/**
 * Passes certain redux actions to ChoirSelection
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        choirSelectedForPractice: (id, name) => dispatch(choirSelectedForPractice(id, name)),
        choirSelectedForChoirs: (id, name) => dispatch(choirSelectedForChoirs(id, name))
    };
};

export default withRouter(connect(null, mapDispatchToProps)(ChoirSelection));
