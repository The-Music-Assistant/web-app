// ----------------------------------------------------------------------------
// File Path: src/pages/Welcome/Welcome.js
// Description: Renders the welcome page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/9/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import { connect } from "react-redux";
import logo from "../../assets/logos/music-assistant-logo.png";
import downArrow from "../../assets/icons/down-arrow-white-fa.svg";
import RectangularButton from "../../components/Buttons/RectangularButton/RectangularButton";
import LoadingHUD from "../../components/LoadingHUD/LoadingHUD";
import AlertBar from "../../components/AlertBar/AlertBar";
import { signOut, welcomePageComplete } from "../../store/actions";
import firebase from "../../vendors/Firebase/firebase";
import { MetroSpinner } from "react-spinners-kit";
import styles from "./Welcome.module.scss";

class Welcome extends Component {
    state = {
        isDoingInitialLoad: true,
        isUserEmailVerified: false,
        isLoading: false
    };

    componentDidMount() {
        this.isUserEmailVerified(true);
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
                        type: "info",
                        heading: "Email Sent",
                        message: "We have sent a new verification email"
                    }
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    isLoading: false,
                    alert: {
                        type: "error",
                        heading: "Authentication Error",
                        message: error.message
                    }
                });
            });
    };

    isUserEmailVerified = isCallerInitialLoad => {
        console.log(isCallerInitialLoad)
        let loadingPropertyName = isCallerInitialLoad ? "isDoingInitialLoad" : "isLoading";
        this.setState({ [loadingPropertyName]: true });
        const currentUser = firebase.auth().currentUser;
        currentUser
            .reload()
            .then(() => {
                if (currentUser.emailVerified) {
                    this.setState({ [loadingPropertyName]: false, isUserEmailVerified: true });
                } else {
                    this.setState({
                        [loadingPropertyName]: false,
                        isUserEmailVerified: false
                    });

                    if (!isCallerInitialLoad) {
                        this.setState({
                            alert: {
                                type: "warning",
                                heading: "Not Verified",
                                message: `Your email is not verified. If you can't find the verification email, please click "Resend Email."`
                            }
                        });
                    }
                }
            })
            .catch(error => {
                this.setState({
                    [loadingPropertyName]: false,
                    isUserEmailVerified: false
                });

                if (!isCallerInitialLoad) {
                    this.setState({
                        alert: {
                            type: "error",
                            heading: "Error",
                            message: error.message
                        }
                    });
                }
            });
    };

    render() {
        let mainContent;
        if (this.props.isAuthLoading || this.state.isDoingInitialLoad) {
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
                                onClick={() => this.isUserEmailVerified(false)}
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

        const welcomeHeaderMessage = this.props.firstName ? (
            <h1 className={styles.welcomeHeaderMessage}>
                {this.props.firstName}, Welcome to <br /> The Music Assistant
            </h1>
        ) : (
            <h1 className={styles.welcomeHeaderMessage}>
                Welcome to <br /> The Music Assistant
            </h1>
        );

        const alertBar = this.state.alert ? (
            <AlertBar
                type={this.state.alert.type}
                heading={this.state.alert.heading}
                message={this.state.alert.message}
                isDone={() => this.setState({ alert: null })}
            />
        ) : null;
        const loadingHUD = this.state.isLoading ? <LoadingHUD text='Loading...' /> : null;

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
                    {welcomeHeaderMessage}
                </div>
                {mainContent}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthLoading: state.auth.isLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        done: () => dispatch(welcomePageComplete())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
