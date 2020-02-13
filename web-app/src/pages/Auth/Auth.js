// ----------------------------------------------------------------------------
// File Path: src/pages/Auth/Auth.js
// Description: Renders the auth page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/3/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import { connect } from "react-redux";
import { authFlowComplete, startAuthFlow } from "../../store/actions";
import logo from "../../assets/logos/music-assistant-logo.png";
import AuthCard from "../../components/AuthCards/AuthCard/AuthCard";
import ProfileCard from "../../components/AuthCards/ProfileCard/ProfileCard";
import LoadingHUD from "../../components/LoadingHUD/LoadingHUD";
import AlertBar from "../../components/AlertBar/AlertBar";
import styles from "./Auth.module.scss";
import * as authStages from "./authStages";

class Auth extends Component {
    // Component state
    // innerHeight holds the window's inner height (used to window resizing)
    state = {
        authStage: authStages.SIGN_IN,
        innerHeight: window.innerHeight,
        isLoading: false,
        alertData: null,
        signInInfo: {
            heading: <h1 className={styles.authInfoHeading}>The Music Assistant</h1>,
            subheading: <h2 className={styles.authInfoSubheading}>A smarter way to sing</h2>
        },
        signUpInfo: {
            heading: (
                <h1 className={styles.authInfoHeading}>
                    Welcome to
                    <br />
                    The Music Assistant
                </h1>
            ),
            subheading: (
                <h2 className={styles.authInfoSubheading}>Your gateway to better singing</h2>
            )
        }
    };

    /**
     * Starts a window resize listener
     * Sets authStage based on passed prop
     */
    componentDidMount() {
        this.props.startAuthFlow();
        window.addEventListener("resize", this.resizeWindow);
    }

    /**
     * Removes the window resize listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeWindow);
    }

    /**
     * Updates state when the inner height of the window changes
     */
    resizeWindow = () => {
        this.setState({ innerHeight: window.innerHeight });
    };

    /**
     * Updates loading state
     */
    setLoadingHandler = isLoading => {
        this.setState({ isLoading });
    };

    /**
     * Sets alertData to null in state when the alert is done
     */
    alertIsDoneHandler = () => {
        this.setState({ alertData: null });
    };

    /**
     * Sets alertData in state when a new alert is triggered
     */
    showAlertHandler = (type, heading, message) => {
        this.setState({
            alertData: { type, heading, message }
        });
    };

    /**
     * Moves to the next auth stage when the current stage is complete
     * If the flow is done, signal to Redux that the flow is done (sign in or sign up)
     */
    authFlowStageDoneHandler = stage => {
        switch (stage) {
            case authStages.SIGN_IN:
                this.props.authFlowComplete(false);
                break;
            case authStages.SIGN_UP:
                // When the sign up stage is complete, move to the profile stage
                this.setState({ authStage: authStages.PROFILE });
                break;
            case authStages.PROFILE:
                this.props.authFlowComplete(true);
                break;
            default:
        }
    };

    switchAuthFlowHandler = () => {
        if (this.state.authStage === authStages.SIGN_IN) {
            this.setState({ authStage: authStages.SIGN_UP });
        } else {
            this.setState({ authStage: authStages.SIGN_IN });
        }
    };

    /**
     * Renders the Auth page
     * The page consists of
     * Auth info
     * An auth card (based on the auth stage)
     */
    render() {
        let authCard;
        let authInfo;

        // Selects the Auth Card and auth info to display based on the auth stage
        switch (this.state.authStage) {
            case authStages.SIGN_IN:
            case authStages.SIGN_UP:
                // Both sign in and sign up stages use the same card
                authCard = (
                    <AuthCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        done={this.authFlowStageDoneHandler}
                        authStage={this.state.authStage}
                        switchAuthFlow={this.switchAuthFlowHandler}
                        authStageDone={this.authFlowStageDoneHandler}
                    />
                );

                // Auth info depends on the auth stage
                authInfo = authStages.SIGN_IN ? this.state.signInInfo : this.state.signUpInfo;
                break;
            case authStages.PROFILE:
                authCard = (
                    <ProfileCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        done={this.authFlowStageDoneHandler}
                    />
                );

                // Since the profile card is only shown during the sign up stage, show the sign up info
                authInfo = this.state.signUpInfo;

                break;
            default:
        }

        // Returns the JSX to display
        return (
            <div className={styles.auth} style={{ minHeight: `${this.state.innerHeight}px` }}>
                {this.state.isLoading ? <LoadingHUD text='Loading...' /> : null}
                {this.state.alertData ? (
                    <AlertBar
                        type={this.state.alertData.type}
                        heading={this.state.alertData.heading}
                        message={this.state.alertData.message}
                        isDone={this.alertIsDoneHandler}
                    />
                ) : null}
                <div className={styles.authContainer}>
                    <div className={styles.authInfo}>
                        <img
                            className={styles.authInfoLogo}
                            src={logo}
                            alt='Music Assistant Logo'
                        />
                        {authInfo.heading}
                        {authInfo.subheading}
                    </div>
                    {authCard}
                </div>
            </div>
        );
    }
}

/**
 * Gets the current state from Redux and passes it to Auth as props
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        authFlowComplete: showWelcomePage => dispatch(authFlowComplete(showWelcomePage)),
        startAuthFlow: () => dispatch(startAuthFlow())
    };
};

export default connect(null, mapDispatchToProps)(Auth);
