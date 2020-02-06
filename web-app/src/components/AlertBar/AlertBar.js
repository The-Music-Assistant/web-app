// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/AuthBar/AuthBar.module.scss
// Description: Renders the alert bar component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/20/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import styles from "./AlertBar.module.scss";
import closeIconWhite from "../../assets/icons/close-icon-white-fa.svg";

class AlertBar extends Component {
    DISPLAY_TIME_MS = 5000;
    TRANSITION_TIME_MS = 1000;

    state = {
        transition: null,
        slideUpTimerId: null,
        isDoneTimerId: null
    };

    componentDidMount() {
        // Fixes React bug where transition down is instant rather than animated
        setTimeout(() => {
            this.setState({ transition: "down" });
        }, 5);

        const slideUpTimerId = setTimeout(() => {
            this.setState({ transition: "up" });
        }, this.TRANSITION_TIME_MS + this.DISPLAY_TIME_MS);

        const isDoneTimerId = setTimeout(() => {
            this.props.isDone();
        }, this.TRANSITION_TIME_MS * 2 + this.DISPLAY_TIME_MS);

        this.setState({ slideUpTimerId, isDoneTimerId });
    }

    closeButttonClickedHandler = () => {
        clearTimeout(this.state.transitionOutTimerId);
        clearTimeout(this.state.isDoneTimerId);
        this.setState({ transition: "up" });
        setTimeout(() => {
            this.props.isDone();
        }, this.TRANSITION_TIME_MS);
    };

    render() {
        let backgroundColorStyle;
        switch (this.props.type) {
            case "success":
                backgroundColorStyle = styles.alertBarSuccess;
                break;
            case "warning":
                backgroundColorStyle = styles.alertBarWarning;
                break;
            case "error":
                backgroundColorStyle = styles.alertBarError;
                break;
            default:
                backgroundColorStyle = styles.alertBarInfo;
        }

        let transitionStyle;
        switch (this.state.transition) {
            case "down":
                transitionStyle = styles.alertBarSlideDown;
                break;
            case "up":
                transitionStyle = styles.alertBarSlideUp;
                break;
            default:
                transitionStyle = null;
        }

        return (
            <div className={[styles.alertBar, backgroundColorStyle, transitionStyle].join(" ")}>
                <div className={styles.alertBarTopGrid}>
                    <div></div>
                    <h1 className={styles.alertBarHeading}>{this.props.heading}</h1>
                    <button
                        className={styles.alertBarCloseButton}
                        onClick={this.closeButttonClickedHandler}
                        type='button'>
                        <img
                            className={styles.alertBarCloseButtonImg}
                            src={closeIconWhite}
                            alt='Close Alert Button'
                        />
                    </button>
                </div>
                <h2 className={styles.alertBarMessage}>{this.props.message}</h2>
            </div>
        );
    }
}

export default AlertBar;
