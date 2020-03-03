// ----------------------------------------------------------------------------
// File Path: src/pages/Welcome/Welcome.js
// Description: Renders the welcome page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/9/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MetroSpinner } from "react-spinners-kit";

// File imports
import { signOut, welcomePageComplete } from "../../store/actions";
import * as alertBarTypes from "../../components/AlertBar/alertBarTypes";
import firebase from "../../vendors/Firebase/firebase";
import * as logs from "../../vendors/Firebase/logs";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";
import downArrow from "../../assets/icons/down-arrow-white-fa.svg";

// Component  imports
import RectangularButton from "../../components/Buttons/RectangularButton/RectangularButton";
import LoadingHUD from "../../components/LoadingHUD/LoadingHUD";
import AlertBar from "../../components/AlertBar/AlertBar";

// Style imports
import styles from "./Welcome.module.scss";

class Welcome extends Component {
    // Component state
    state = {
        isDoingInitialLoad: true,
        isUserEmailVerified: false,
        isLoading: false
    };

    componentDidMount() {
        this.checkIfUserEmailIsVerified(true);
    }

    doneButtonClickedHandler = () => {
        this.props.done();
    };

    resendEmailVerificationButtonClickedHandler = () => {
        this.setState({ isLoading: true });
        firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
                this.setState({
                    isLoading: false,
                    alert: {
                        type: alertBarTypes.INFO,
                        heading: "Email Sent",
                        message: "We have sent a new verification email"
                    }
                });
            })
            .catch(error => {
                logs.authError(
                    error.code,
                    error.message,
                    "[Welcome/resendEmailVerificationButtonClickedHandler]"
                );
                this.setState({
                    isLoading: false,
                    alert: {
                        type: alertBarTypes.ERROR,
                        heading: "Authentication Error",
                        message: error.message
                    }
                });
            });
    };

    /**
     * Checks if the user's email is verified
     * Updates UI depending on result
     * @param {bool} isCallerInitialLoad - Is the caller of this function calling during the initial load of the page
     */
    checkIfUserEmailIsVerified = isCallerInitialLoad => {
        // Flips boolean flag for correct state loading key
        let stateLoadingKey = isCallerInitialLoad ? "isDoingInitialLoad" : "isLoading";
        this.setState({ [stateLoadingKey]: true });

        // Reloads the user and checks if the user's email is verified
        const currentUser = firebase.auth().currentUser;
        currentUser
            .reload()
            .then(() => {
                if (currentUser.emailVerified) {
                    this.userEmailIsVerified(stateLoadingKey);
                } else {
                    this.userEmailNotVerified(isCallerInitialLoad, stateLoadingKey);
                }
            })
            .catch(error => {
                this.userEmailFetchError(isCallerInitialLoad, stateLoadingKey, error);
            });
    };

    /**
     * Updates state to indicate that the email is verified
     * @param {string} stateLoadingKey - The state loading key to use
     */
    userEmailIsVerified = stateLoadingKey => {
        this.setState({ [stateLoadingKey]: false, isUserEmailVerified: true });
    };

    /**
     * Updates the state to indicate that the email is not verified
     * Alerts the user that the email is not verified
     * @param {bool} isCallerInitialLoad - Is the caller of this function calling during the initial load of the page
     * @param {string} stateLoadingKey - The state loading key to use
     */
    userEmailNotVerified = (isCallerInitialLoad, stateLoadingKey) => {
        // Updates state
        this.setState({
            [stateLoadingKey]: false,
            isUserEmailVerified: false
        });

        // Alerts the user only if this is not the first email check
        if (!isCallerInitialLoad) {
            this.setState({
                alert: {
                    type: alertBarTypes.WARNING,
                    heading: "Not Verified",
                    message: `Your email is not verified. If you can't find the verification email, please click "Resend Email."`
                }
            });
        }
    };

    /**
     * Updates the state to indicate that the email is not verified
     * Alerts the user that there was an error reloading the user
     * @param {bool} isCallerInitialLoad - Is the caller of this function calling during the initial load of the page
     * @param {string} stateLoadingKey - The state loading key to use
     * @param {object} error - The error received
     */
    userEmailFetchError = (isCallerInitialLoad, stateLoadingKey, error) => {
        // Updates state
        this.setState({
            [stateLoadingKey]: false,
            isUserEmailVerified: false
        });

        // Alerts the user only if this is not the first email check
        if (!isCallerInitialLoad) {
            this.setState({
                alert: {
                    type: alertBarTypes.ERROR,
                    heading: "Error",
                    message: error.message
                }
            });
        }
    };

    /**
     * Renders the Welcome component
     */
    render() {
        // Determines what to display as the main content (loading spinner, email verified info, or email not verified info)
        let mainContent;
        if (this.state.isDoingInitialLoad) {
            mainContent = (
                <div className={styles.welcomeMain}>
                    <div className={styles.welcomeMainSpinner}>
                        <MetroSpinner size={75} color='#FFFFFF' loading={true} />
                    </div>
                </div>
            );
        } else if (this.state.isUserEmailVerified) {
            mainContent = (
                <div className={styles.welcomeMain}>
                    <p className={styles.welcomeMainMessage}>
                        Your account has been created and a new experience awaits! Click "Let's Go!"
                        to add your first choir.
                    </p>
                    <img className={styles.welcomeMainDownArrow} src={downArrow} alt='Down Arrow' />
                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor='orange'
                            type='button'
                            value=''
                            text="Let's Go!"
                            onClick={this.doneButtonClickedHandler}
                        />
                    </div>
                </div>
            );
        } else {
            mainContent = (
                <div className={styles.welcomeMain}>
                    <p className={styles.welcomeMainMessage}>
                        {`Please check your email (${
                            firebase.auth().currentUser.email
                        }) for a message from "The Music Assistant." Click the link to verify your email address and then come back here!`}
                    </p>
                    <img className={styles.welcomeMainDownArrow} src={downArrow} alt='Down Arrow' />
                    <div className={styles.welcomeMainButtons}>
                        <div className={styles.welcomeMainButton}>
                            <RectangularButton
                                backgroundColor='orange'
                                type='button'
                                value=''
                                text='I Verified My Email'
                                onClick={() => this.checkIfUserEmailIsVerified(false)}
                            />
                        </div>
                        <div className={styles.welcomeMainButton}>
                            <RectangularButton
                                backgroundColor='blue'
                                type='button'
                                value=''
                                text='Resend Email'
                                onClick={this.resendEmailVerificationButtonClickedHandler}
                            />
                        </div>
                        <div className={styles.welcomeMainButton}>
                            <RectangularButton
                                backgroundColor='red'
                                type='button'
                                value=''
                                text='Sign Out'
                                onClick={this.props.signOut}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        // Adds an alert bar is one is requested
        const alertBar = this.state.alert ? (
            <AlertBar
                type={this.state.alert.type}
                heading={this.state.alert.heading}
                message={this.state.alert.message}
                done={() => this.setState({ alert: null })}
            />
        ) : null;

        // Adds the loading HUD if one is requested
        const loadingHUD = this.state.isLoading ? <LoadingHUD text='Loading...' /> : null;

        // Returns the JSX to render
        return (
            <div className={styles.welcome}>
                {alertBar}
                {loadingHUD}
                <div className={styles.welcomeHeader}>
                    <img
                        className={styles.welcomeHeaderLogo}
                        src={logo}
                        alt='Music Assistant Logo'
                    />
                    <h1 className={styles.welcomeHeaderMessage}>
                        Welcome to <br /> The Music Assistant
                    </h1>
                </div>
                {mainContent}
            </div>
        );
    }
}

/**
 * Passes certain redux actions to Welcome
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        done: () => dispatch(welcomePageComplete()),
        signOut: () => dispatch(signOut())
    };
};

// Prop types for the Welcome component
Welcome.propTypes = {
    done: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Welcome);
