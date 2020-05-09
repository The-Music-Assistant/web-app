// NPM module imports
import React, { useState, useEffect, useRef } from "react";

// File imports
import * as authStages from "./authStages";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";

// Component imports
import EmailPasswordCard from "../../components/AuthCards/EmailPasswordCard/EmailPasswordCard";
import ProfileCard from "../../components/AuthCards/ProfileCard/ProfileCard";
import LoadingHUD from "../../components/Spinners/LoadingHUD/LoadingHUD";
import AlertBar from "../../components/AlertBar/AlertBar";

// Style imports
import styles from "./Auth.module.scss";

/**
 * Renders the Auth component.
 * This component handles both the sign up and sign in auth flows.
 * @component
 * @category Auth
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Auth = () => {
    /*
     * The current auth stage (see authStages enum)
     * @type {[authStage, setAuthStage]: [module:authStages, function]}
     */
    const [authStage, setAuthStage] = useState(authStages.SIGN_IN);

    /*
     * The inner height of the window (used to resize the component)
     * @type {[windowInnerHeight, setWindowInnerHeight] : [number, function]}
     */
    const [windowInnerHeight, setWindowInnerHeight] = useState(
        window.innerHeight
    );

    /**
     * Indicates whether the component is in a loading state
     * {[isLoading, setIsLoading]: [boolean, function]}
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Data used to display an alert
     * {[alertData, setAlertData]: [object, function]}
     * {module:alertBarTypes} alertData.type - The type of alert bar to show
     * {string} alertData.heading - The alert heading
     * {string} alertData.message - The alert message
     */
    const [alertData, setAlertData] = useState(null);

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    let isMounted = useRef(false);

    /**
     * Sets isMounted to true
     * Adds a window resize listener
     * @returns {object} A cleanup function that sets isMounted to false and removes the window resize listener
     */
    useEffect(() => {
        isMounted.current = true;
        window.addEventListener("resize", resizeWindow);

        return () => {
            isMounted.current = false;
            window.removeEventListener("resize", resizeWindow);
        };
    }, []);

    /**
     * Updates state when the inner height of the window changes
     */
    const resizeWindow = () => {
        if (isMounted.current) setWindowInnerHeight(window.innerHeight);
    };

    /**
     * Updates loading state
     */
    const setLoadingHandler = (isLoading) => {
        if (isMounted.current) setIsLoading(isLoading);
    };

    /**
     * Sets alertData in state when a new alert is triggered
     * @param {alertBarTypes} - The type of alert bar to show
     * @param {string} - The alert heading
     * @param {string} - The alert message
     */
    const showAlertHandler = (type, heading, message) => {
        if (isMounted.current) setAlertData({ type, heading, message });
    };

    /**
     * Sets alertData in state to null in state when the alert disappears
     */
    const alertIsDoneHandler = () => {
        if (isMounted.current) setAlertData(null);
    };

    /**
     * Moves to the next auth stage when the current stage is complete.
     * If the flow is done, signals to Redux that the flow is done (sign in or sign up).
     * @param {module:authStages} - The auth stage that is complete
     */
    const authFlowStageDoneHandler = (stage) => {
        if (isMounted.current && stage === authStages.SIGN_UP) {
            setAuthStage(authStages.PROFILE);
        }
    };

    /**
     * Switches to the opposite auth flow.
     * If the current auth flow is sign in, switch to sign up, and vice versa.
     */
    const switchAuthFlowHandler = () => {
        if (isMounted.current) {
            if (authStage === authStages.SIGN_IN) {
                setAuthStage(authStages.SIGN_UP);
            } else {
                setAuthStage(authStages.SIGN_IN);
            }
        }
    };

    /**
     * Gets the correct auth card based on the current auth stage
     * @returns {object} An auth card (JSX)
     */
    const getAuthCard = () => {
        // Selects the Auth Card and auth info to display based on the auth stage
        switch (authStage) {
            case authStages.SIGN_IN:
            case authStages.SIGN_UP:
                // Both sign in and sign up stages use the same card
                return (
                    <EmailPasswordCard
                        setLoading={setLoadingHandler}
                        showAlert={showAlertHandler}
                        done={authFlowStageDoneHandler}
                        authStage={authStage}
                        switchAuthFlow={switchAuthFlowHandler}
                    />
                );
            case authStages.PROFILE:
                return (
                    <ProfileCard
                        setLoading={setLoadingHandler}
                        showAlert={showAlertHandler}
                        done={authFlowStageDoneHandler}
                    />
                );
            default:
                return null;
        }
    };

    /*
     * Renders the Auth component
     */
    return (
        <div
            className={styles.auth}
            style={{ minHeight: `${windowInnerHeight}px` }}
        >
            {/* Loading HUD (if needed) */}
            {isLoading ? <LoadingHUD message="Loading..." /> : null}

            {/* Alert bar (if needed) */}
            {alertData ? (
                <AlertBar
                    type={alertData.type}
                    heading={alertData.heading}
                    message={alertData.message}
                    done={alertIsDoneHandler}
                />
            ) : null}

            {/* Inner container */}
            <section className={styles.authInnerContainer}>
                {/* Info */}
                <section className={styles.authInnerContainerInfo}>
                    {/* Logo */}
                    <img
                        className={styles.authInnerContainerInfoLogo}
                        src={logo}
                        alt="Music Assistant Logo"
                    />

                    {/* Heading */}
                    <h1 className={styles.authInnerContainerInfoHeading}>
                        The Music Assistant
                    </h1>

                    {/* Subheading */}
                    <h2 className={styles.authInnerContainerInfoSubheading}>
                        A smarter way to sing
                    </h2>
                </section>

                {/* Auth card */}
                {getAuthCard()}
            </section>
        </div>
    );
};

export default Auth;
