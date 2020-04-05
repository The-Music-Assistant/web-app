// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// File imports
import { authFlowComplete, startAuthFlow } from "../../store/actions/index";
import * as authStages from "./authStages";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";

// Component imports
import AuthCard from "../../components/AuthCards/AuthCard/AuthCard";
import ProfileCard from "../../components/AuthCards/ProfileCard/ProfileCard";
import LoadingHUD from "../../components/Spinners/LoadingHUD/LoadingHUD";
import AlertBar from "../../components/AlertBar/AlertBar";

// Style imports
import styles from "./Auth.module.scss";

/**
 * Renders the Auth component.
 * This component handles both the sign up and sign in auth flows.
 * @extends {Component}
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class Auth extends Component {
    /**
     * Auth component state
     * @property {authStages} authStage - The current auth stage (see authStages enum)
     * @property {number} innerHeight - The inner height of the window (used to resize the component)
     * @property {boolean} isLoading - Indicates whether the component is in a loading state
     * @property {object} alertData - Data used to display an alert
     * @property {alertBarTypes} alertData.type - The type of alert bar to show
     * @property {string} alertData.heading - The alert heading
     * @property {string} alertData.message - The alert message
     */
    state = {
        authStage: authStages.SIGN_IN,
        innerHeight: window.innerHeight,
        isLoading: false,
        alertData: null,
    };

    /**
     * Starts the auth flow.
     * Starts a window resize listener.
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
     * @function
     */
    resizeWindow = () => {
        this.setState({ innerHeight: window.innerHeight });
    };

    /**
     * Updates loading state
     * @function
     */
    setLoadingHandler = (isLoading) => {
        this.setState({ isLoading });
    };

    /**
     * Sets alertData in state when a new alert is triggered
     * @function
     * @param {alertBarTypes} - The type of alert bar to show
     * @param {string} - The alert heading
     * @param {string} - The alert message
     */
    showAlertHandler = (type, heading, message) => {
        this.setState({
            alertData: { type, heading, message },
        });
    };

    /**
     * Sets alertData in state to null in state when the alert disappears
     * @function
     */
    alertIsDoneHandler = () => {
        this.setState({ alertData: null });
    };

    /**
     * Moves to the next auth stage when the current stage is complete.
     * If the flow is done, signals to Redux that the flow is done (sign in or sign up).
     * @function
     * @param {authStages} - The auth stage that is complete (see authStages enum)
     */
    authFlowStageDoneHandler = (stage) => {
        switch (stage) {
            case authStages.SIGN_IN:
                // The sign in auth flow is complete
                this.props.authFlowComplete(false);
                break;
            case authStages.SIGN_UP:
                // Moves to the profile auth stage
                this.setState({ authStage: authStages.PROFILE });
                break;
            case authStages.PROFILE:
                // The sign up auth flow is complete
                this.props.authFlowComplete(true);
                break;
            default:
        }
    };

    /**
     * Switches to the opposite auth flow.
     * If the current auth flow is sign in, switch to sign up, and vice versa.
     * @function
     */
    switchAuthFlowHandler = () => {
        if (this.state.authStage === authStages.SIGN_IN) {
            this.setState({ authStage: authStages.SIGN_UP });
        } else {
            this.setState({ authStage: authStages.SIGN_IN });
        }
    };

    /**
     * Gets the correct auth card based on the current auth stage
     * @function
     * @returns {object} An auth card (JSX)
     */
    getAuthCard = () => {
        // Selects the Auth Card and auth info to display based on the auth stage
        switch (this.state.authStage) {
            case authStages.SIGN_IN:
            case authStages.SIGN_UP:
                // Both sign in and sign up stages use the same card
                return (
                    <AuthCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        done={this.authFlowStageDoneHandler}
                        authStage={this.state.authStage}
                        switchAuthFlow={this.switchAuthFlowHandler}
                        authStageDone={this.authFlowStageDoneHandler}
                    />
                );
            case authStages.PROFILE:
                return (
                    <ProfileCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        done={this.authFlowStageDoneHandler}
                    />
                );
            default:
                return null;
        }
    };

    /**
     * Renders the Auth component
     * @returns {object} The JSX to render
     */
    render() {
        return (
            <div className={styles.auth} style={{ minHeight: `${this.state.innerHeight}px` }}>
                {this.state.isLoading ? <LoadingHUD text='Loading...' /> : null}
                {this.state.alertData ? (
                    <AlertBar
                        type={this.state.alertData.type}
                        heading={this.state.alertData.heading}
                        message={this.state.alertData.message}
                        done={this.alertIsDoneHandler}
                    />
                ) : null}
                <div className={styles.authContainer}>
                    <div className={styles.authInfo}>
                        <img
                            className={styles.authInfoLogo}
                            src={logo}
                            alt='Music Assistant Logo'
                        />
                        <h1 className={styles.authInfoHeading}>The Music Assistant</h1>
                        <h2 className={styles.authInfoSubheading}>A smarter way to sing</h2>
                    </div>
                    {this.getAuthCard()}
                </div>
            </div>
        );
    }
}

/**
 * Passes certain Redux actions to the App component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Auth
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the Auth component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        startAuthFlow: () => dispatch(startAuthFlow()),
        authFlowComplete: (shouldShowWelcomePage) =>
            dispatch(authFlowComplete(shouldShowWelcomePage)),
    };
};

// Prop types for the Auth component
Auth.propTypes = {
    /**
     * Tells Redux to start the auth flow
     */
    startAuthFlow: PropTypes.func.isRequired,
    /**
     * Tells Redux that the auth flow is complete
     */
    authFlowComplete: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Auth);
