// NPM module imports
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MetroSpinner } from "react-spinners-kit";

// File imports
import { signOut, welcomePageComplete } from "../../store/actions/index";
import * as alertBarTypes from "../../components/AlertBar/alertBarTypes";
import firebase from "../../vendors/Firebase/firebase";
import { authError } from "../../vendors/Firebase/logs";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";
import downArrow from "../../assets/icons/down-arrow-white.svg";

// Component  imports
import RectangularButton from "../../components/Buttons/RectangularButton/RectangularButton";
import AlertBar from "../../components/AlertBar/AlertBar";

// Style imports
import styles from "./Welcome.module.scss";

/**
 * Renders the Welcome component.
 * This component displays when a user needs to confirm their email.
 * @extends {Component}
 * @component
 * @category Welcome
 * @author Dan Levy <danlevy124@gmail.com>
 */
class Welcome extends Component {
    /**
     * Welcome component state
     * @property {boolean} isLoading - Indicates if the component is in a loading state
     * @property {boolean} isUserEmailVerified - Indicates if the user's email is verified
     */
    state = {
        isLoading: false,
        isUserEmailVerified: false,
    };

    /**
     * Indicates if the user's email was checked for verification at least once
     */
    _wasEmailVerificationCheckedAlready = false;

    /**
     * Checks if the user's email is verified
     */
    componentDidMount() {
        this.checkIfUserEmailIsVerified();
    }

    /**
     * Checks if the user's email is verified.
     * Updates state depending on result.
     * @function
     */
    checkIfUserEmailIsVerified = () => {
        // Sets loading to true in state
        this.setState({ isLoading: true });

        // Reloads the user and checks if the user's email is verified
        const currentUser = firebase.auth().currentUser;
        currentUser
            .reload()
            .then(() => {
                if (currentUser.emailVerified) {
                    this.userEmailIsVerified();
                } else {
                    this.userEmailNotVerified();
                }
                this._wasEmailVerificationCheckedAlready = true;
            })
            .catch(this.userEmailFetchError);
    };

    /**
     * Updates state to indicate that the email is verified
     * @function
     */
    userEmailIsVerified = () => {
        this.setState({ isLoading: false, isUserEmailVerified: true });
    };

    /**
     * Updates state to indicate that the email is not verified
     * Alerts the user that the email is not verified
     * @function
     */
    userEmailNotVerified = () => {
        // Updates state
        this.setState({
            isLoading: false,
            isUserEmailVerified: false,
        });

        // Alerts the user only if this is not the first check
        if (this._wasEmailVerificationCheckedAlready) {
            this.setState({
                alert: {
                    type: alertBarTypes.WARNING,
                    heading: "Not Verified",
                    message: `Your email is not verified. If you can't find the verification email, please click "Resend Email."`,
                },
            });
        }
    };

    /**
     * Updates the state to indicate that the email is not verified.
     * Alerts the user that there was an error.
     * @function
     * @param {object} error - The error received
     */
    userEmailFetchError = (error) => {
        authError(error.code, error.message, "[Welcome/userEmailFetchError]");
        this.setState({
            isLoading: false,
            alert: {
                type: alertBarTypes.ERROR,
                heading: "Error",
                message: error.message,
            },
        });
    };

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     * @function
     */
    doneButtonClickedHandler = () => {
        this.props.done();
    };

    /**
     * Resends an email verification
     * @function
     */
    resendEmailVerificationButtonClickedHandler = () => {
        // Sets loading to true in state
        this.setState({ isLoading: true });

        // Sends an email verification
        firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(this.emailWasSentHandler)
            .catch(this.userEmailFetchError);
    };

    /**
     * Updates state to indicate that a verification email was sent.
     * Alerts the user that a verification email was sent.
     * @function
     */
    emailWasSentHandler = () => {
        this.setState({
            isLoading: false,
            alert: {
                type: alertBarTypes.INFO,
                heading: "Email Sent",
                message: "We have sent a new verification email",
            },
        });
    };

    /**
     * Creates an alert bar if one was requested
     * @function
     * @returns {object} An alert bar (JSX)
     */
    getAlertBar = () => {
        return this.state.alert ? (
            <AlertBar
                type={this.state.alert.type}
                heading={this.state.alert.heading}
                message={this.state.alert.message}
                done={() => this.setState({ alert: null })}
            />
        ) : null;
    };

    /**
     * Gets the main component (loading spinner, success, or check email)
     * @function
     * @returns {object} The main component (JSX)
     */
    getMainComponent = () => {
        if (this.state.isLoading) {
            return this.getSpinner();
        } else if (this.state.isUserEmailVerified) {
            return this.getSuccessComponent();
        } else {
            return this.getCheckEmailComponent();
        }
    };

    /**
     * Creates a spinner
     * @function
     * @returns {object} A spinner (JSX)
     */
    getSpinner = () => {
        return (
            <div className={styles.welcomeMainSpinner}>
                <MetroSpinner size={75} color="#F8F8F8" loading={true} />
            </div>
        );
    };

    /**
     * Creates the success component
     * @function
     * @returns {object} A success component (JSX)
     */
    getSuccessComponent = () => {
        return (
            <Fragment>
                {/* Heading */}
                <p className={styles.welcomeMainMessage}>
                    Your account has been created and a new experience awaits!
                    Click "Let's Go!" to add your first choir.
                </p>

                {/* Down arrow */}
                <img
                    className={styles.welcomeMainDownArrow}
                    src={downArrow}
                    alt="Down Arrow"
                />

                {/* Done Button */}
                <div className={styles.welcomeMainButton}>
                    <RectangularButton
                        backgroundColor="orange"
                        type="button"
                        value=""
                        title="Let's Go!"
                        onClick={this.doneButtonClickedHandler}
                    />
                </div>
            </Fragment>
        );
    };

    /**
     * Creates a check email component
     * @function
     * @returns {object} A check email component (JSX)
     */
    getCheckEmailComponent = () => {
        return (
            <Fragment>
                {/* Heading */}
                <p className={styles.welcomeMainMessage}>
                    {`Please check your email (${
                        firebase.auth().currentUser.email
                    }) for a message from "The Music Assistant." Click the link to verify your email address and then come back here!`}
                </p>

                {/* Down arrow */}
                <img
                    className={styles.welcomeMainDownArrow}
                    src={downArrow}
                    alt="Down Arrow"
                />

                {/* Options */}
                <section className={styles.welcomeMainButtons}>
                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor="orange"
                            type="button"
                            value=""
                            title="I Verified My Email"
                            onClick={() => this.checkIfUserEmailIsVerified()}
                        />
                    </div>

                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor="blue"
                            type="button"
                            value=""
                            title="Resend Email"
                            onClick={
                                this.resendEmailVerificationButtonClickedHandler
                            }
                        />
                    </div>

                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor="red"
                            type="button"
                            value=""
                            title="Sign Out"
                            onClick={this.props.signOut}
                        />
                    </div>
                </section>
            </Fragment>
        );
    };

    /**
     * Renders the Welcome component
     * @returns {object} The JSX to render
     */
    render() {
        // Returns the JSX to render
        return (
            <div className={styles.welcome}>
                {this.getAlertBar()}

                {/* Page header */}
                <header className={styles.welcomeHeader}>
                    <img
                        className={styles.welcomeHeaderLogo}
                        src={logo}
                        alt="Music Assistant Logo"
                    />
                    <h1 className={styles.welcomeHeaderMessage}>
                        Welcome to <br /> The Music Assistant
                    </h1>
                </header>

                <main className={styles.welcomeMain}>
                    {this.getMainComponent()}
                </main>
            </div>
        );
    }
}

// Prop types for the Welcome component
Welcome.propTypes = {
    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,

    /**
     * Tells Redux to sign the user out
     */
    signOut: PropTypes.func.isRequired,
};

/**
 * Passes certain Redux actions to the Welcome component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Welcome
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the Welcome component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        done: () => dispatch(welcomePageComplete()),
        signOut: () => dispatch(signOut()),
    };
};

export default connect(null, mapDispatchToProps)(Welcome);
