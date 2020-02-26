// ----------------------------------------------------------------------------
// File Path: src/components/ChoirSelection/ChoirSelection.js
// Description: Renders the choir selection component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/19/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import shortid from "shortid";
import { MetroSpinner } from "react-spinners-kit";

// Component imports
import ChoirCard from "./ChoirCard/ChoirCard";

// Image imports
import plusIcon from "../../assets/icons/plus-icon.svg";
import questionIcon from "../../assets/icons/question-icon.svg";

// File imports
import * as logs from "../../vendors/Firebase/logs";
import { getUsersChoirs, joinChoir } from "../../App/musicAssistantApi";
import * as alertBarTypes from "../AlertBar/alertBarTypes";

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

    // Timeout id (used if components unmounts)
    loadingWaitTimeoutId = null;

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
        this.loadingWaitTimeoutId = setTimeout(() => {
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
                    error.code,
                    error.message,
                    "[ChoirSelection/getChoirList]"
                );
                this.props.showAlert(alertBarTypes.ERROR, "Error", error.message);
                if (this._isMounted) this.setState({ isLoading: false });
            });
    }

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
                    this.props.showAlert(alertBarTypes.ERROR, "Error", error.message);
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
                    <Link key={shortid.generate()} to={`${this.props.match.url}/sheet-music`}>
                        <ChoirCard
                            id={choir.choir_id}
                            headerImgSrc={choir.picture_url}
                            name={choir.choir_name}
                            description={choir.description}
                            noDescription={false}
                            cardColor={colors[colorIndex]}
                        />
                    </Link>
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
        // The component to display
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
            component = <div className={styles.choirSelection}>{this.createChoirComponents()}</div>;
        }

        // Returns the component to display
        return component;
    }
}

export default withRouter(ChoirSelection);
