// ----------------------------------------------------------------------------
// File Path: src/pages/Welcome/Welcome.js
// Description: Renders the welcome page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/9/2020
// ----------------------------------------------------------------------------

import React from "react";
import {connect} from "react-redux";
import logo from "../../assets/logos/music-assistant-logo.png";
import downArrow from "../../assets/icons/down-arrow-white-fa.svg";
import RectangularButton from "../../components/Buttons/RectangularButton/RectangularButton";
import {welcomePageDone} from "../../store/actions";
import styles from "./Welcome.module.scss";

const Welcome = props => {
    const buttonClickedHandler = () => {
        props.done();
    }

    return (
        <div className={styles.welcome}>
            <div className={styles.welcomeHeader}>
                <img className={styles.welcomeHeaderLogo} src={logo} alt='Music Assistant Logo' />
                <h1 className={styles.welcomeHeaderMessage}>
                    {props.firstName}, Welcome to <br /> The Music Assistant
                </h1>
            </div>
            <div className={styles.welcomeMain}>
                <p className={styles.welcomeMainMessage}>
                    Your account has been created and a new experience awaits! Click "Let's Go!" to
                    add your first choir.
                </p>
                <img className={styles.welcomeMainDownArrow} src={downArrow} alt='Down Arrow' />
                <div className={styles.welcomeMainButton}>
                    <RectangularButton
                        backgroundColor='orange'
                        type='button'
                        value=''
                        text="Let's Go!"
                        onClick={buttonClickedHandler}
                    />
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        done: () => dispatch(welcomePageDone())
    }
}

export default connect(null, mapDispatchToProps)(Welcome);
