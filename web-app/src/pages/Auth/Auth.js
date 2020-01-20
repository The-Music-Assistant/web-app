// ----------------------------------------------------------------------------
// File Path: src/pages/Auth/Auth.js
// Description: Renders the auth page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/3/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import styles from "./Auth.module.scss";
import logo from "../../assets/logos/music-assistant-logo.png";
import SignUpCard from "../../components/AuthCards/SignUpCard/SignUpCard";
import ProfileCard from "../../components/AuthCards/ProfileCard/ProfileCard";
import ChoirQuestionCard from "../../components/AuthCards/ChoirQuestionCard/ChoirQuestionCard";
import EnterCodeCard from "../../components/AuthCards/EnterCodeCard/EnterCodeCard";
import WaitForCodeCard from "../../components/AuthCards/WaitForCodeCard/WaitForCodeCard";
import ChoirSetupCard from "../../components/AuthCards/ChoirSetupCard/ChoirSetupCard";
import SignInCard from "../../components/AuthCards/SignInCard/SignInCard";
import LoadingHUD from "../../components/LoadingHUD/LoadingHUD";
import * as authTypes from "./authTypes";

class Auth extends Component {
    state = {
        authType: authTypes.SIGN_UP,
        innerHeight: window.innerHeight,
        isLoading: false
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
        heading: <h1 className={styles.authInfoHeading}>Welcome Back!</h1>,
        subheading: (
            <h2 className={styles.authInfoSubheading}>
                The Music Assistant
                <br />A smarter way to sing
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

    loadingHandler = isLoading => {
        this.setState({ isLoading });
    };

    render() {
        let authCard;
        let authInfo;

        switch (this.state.authType) {
            case authTypes.SIGN_UP:
                authCard = <SignUpCard loading={this.loadingHandler} />;
                authInfo = this.signUpInfo;
                break;
            case authTypes.PROFILE:
                authCard = <ProfileCard loading={this.loadingHandler} />;
                authInfo = this.signUpInfo;
                break;
            case authTypes.CHOIR_QUESTION:
                authCard = <ChoirQuestionCard loading={this.loadingHandler} />;
                authInfo = this.signUpInfo;
                break;
            case authTypes.ENTER_CODE:
                authCard = <EnterCodeCard loading={this.loadingHandler} />;
                authInfo = this.signUpInfo;
                break;
            case authTypes.WAIT_FOR_CODE:
                authCard = <WaitForCodeCard loading={this.loadingHandler} />;
                authInfo = this.signUpInfo;
                break;
            case authTypes.CHOIR_SET_UP:
                authCard = <ChoirSetupCard loading={this.loadingHandler} />;
                authInfo = this.signUpInfo;
                break;
            default:
                authCard = <SignInCard loading={this.loadingHandler} />;
                authInfo = this.signInInfo;
        }

        return (
            <div className={styles.auth} style={{ minHeight: `${this.state.innerHeight}px` }}>
                {this.state.isLoading ? <LoadingHUD text='Loading...' /> : null}
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

export default Auth;
