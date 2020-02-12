// ----------------------------------------------------------------------------
// File Path: src/pages/Auth/Auth.js
// Description: Renders the auth page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/3/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import { connect } from "react-redux";
import logo from "../../assets/logos/music-assistant-logo.png";
import AuthCard from "../../components/AuthCards/AuthCard/AuthCard";
import ProfileCard from "../../components/AuthCards/ProfileCard/ProfileCard";
import LoadingHUD from "../../components/LoadingHUD/LoadingHUD";
import AlertBar from "../../components/AlertBar/AlertBar";
import styles from "./Auth.module.scss";
import { endSignIn, endSignUp } from "../../store/actions";
import * as authFlows from "./authFlows";
import * as authStages from "./authStages";

class Auth extends Component {
    state = {
        authStage: this.props.authFlow === authFlows.SIGN_IN ? authStages.SIGN_IN : authStages.SIGN_UP,
        innerHeight: window.innerHeight,
        isLoading: false,
        alert: null
    };

    signUpInfo = {
        heading: (
            <h1 className={styles.authInfoHeading}>
                Welcome to
                <br />
                The Music Assistant
            </h1>
        ),
        subheading: <h2 className={styles.authInfoSubheading}>Your gateway to better singing</h2>
    };

    signInInfo = {
        heading: <h1 className={styles.authInfoHeading}>The Music Assistant</h1>,
        subheading: (
            <h2 className={styles.authInfoSubheading}>
                A smarter way to sing
            </h2>
        )
    };

    componentDidMount() {
        window.addEventListener("resize", this.resizeWindow);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeWindow);
    }

    resizeWindow = () => {
        this.setState({ innerHeight: window.innerHeight });
    };

    setLoadingHandler = isLoading => {
        this.setState({ isLoading });
    };

    alertIsDoneHandler = () => {
        this.setState({ alert: null });
    };

    showAlertHandler = (type, heading, message) => {
        this.setState({
            alert: { type, heading, message }
        });
    };

    authFlowStageDoneHandler = stage => {
        switch (stage) {
            case authStages.SIGN_IN:
                this.props.endSignIn();
                break;
            case authStages.SIGN_UP:
                this.setState({ authStage: authStages.PROFILE });
                break;
            case authStages.PROFILE:
                this.props.endSignUp();
                break;
            default:
        }
    };

    render() {
        let authCard;
        let authInfo;

        switch (this.state.authStage) {
            case authStages.SIGN_IN:
                authCard = (
                    <AuthCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        isAuthenticated={this.props.isAuthenticated}
                        done={this.authFlowStageDoneHandler}
                    />
                );
                authInfo = this.signInInfo;
                break;
            case authStages.SIGN_UP:
                authCard = (
                    <AuthCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        isAuthenticated={this.props.isAuthenticated}
                        done={this.authFlowStageDoneHandler}
                    />
                );
                authInfo = this.signUpInfo;
                break;
            case authStages.PROFILE:
                authCard = (
                    <ProfileCard
                        setLoading={this.setLoadingHandler}
                        showAlert={this.showAlertHandler}
                        isAuthenticated={this.props.isAuthenticated}
                        done={this.authFlowStageDoneHandler}
                    />
                );
                authInfo = this.signUpInfo;
                break;
            default:
        }

        return (
            <div className={styles.auth} style={{ minHeight: `${this.state.innerHeight}px` }}>
                {this.state.isLoading ? <LoadingHUD text='Loading...' /> : null}
                {this.state.alert ? (
                    <AlertBar
                        type={this.state.alert.type}
                        heading={this.state.alert.heading}
                        message={this.state.alert.message}
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

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        authFlow: state.auth.authFlow
    };
};

const mapDispatchToProps = dispatch => {
    return {
        endSignIn: () => dispatch(endSignIn()),
        endSignUp: () => dispatch(endSignUp())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
