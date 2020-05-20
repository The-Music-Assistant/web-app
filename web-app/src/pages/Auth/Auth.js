// NPM module imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

// File imports
import * as authStages from "./authStages";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";

// Component imports
import EmailPasswordCard from "../../components/AuthCards/EmailPasswordCard/EmailPasswordCard";
import ProfileCard from "../../components/AuthCards/ProfileCard/ProfileCard";
import LoadingHUD from "../../components/Spinners/LoadingHUD/LoadingHUD";

// Style imports
import styles from "./Auth.module.scss";

/**
 * Renders the Auth component.
 * This component handles both the sign up and sign in auth flows.
 * @component
 * @category Auth
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Auth = ({ done }) => {
    /*
     * The current auth stage (see authStages enum)
     * @type {[authStage, setAuthStage]: [module:authStages, function]}
     */
    const [authStage, setAuthStage] = useState(authStages.SIGN_IN);

    /**
     * Indicates whether the component is in a loading state
     * {[isLoading, setIsLoading]: [boolean, function]}
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    let isMounted = useRef(false);

    /**
     * Sets isMounted to true
     * @returns {object} A cleanup function that sets isMounted to false
     */
    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * Updates loading state
     */
    const setIsLoadingHandler = useCallback((isLoading) => {
        if (isMounted.current) setIsLoading(isLoading);
    }, []);

    /**
     * Moves to the next auth stage when the current stage is complete.
     * If the flow is done, it alerts the parent component
     */
    const authFlowStageDoneHandler = useCallback(() => {
        if (authStage === authStages.SIGN_UP) {
            setAuthStage(authStages.PROFILE);
        } else {
            const isSignUpFlow =
                authStage === authStages.SIGN_IN ? false : true;
            done(isSignUpFlow);
        }
    }, [authStage, done]);

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
                // The auth stage passed to the EmailPasswordCard component is the same as the equivalent auth flow (Sign in or sign up)
                return (
                    <EmailPasswordCard
                        setIsLoading={setIsLoadingHandler}
                        authFlow={authStage}
                        switchAuthFlow={switchAuthFlowHandler}
                        done={authFlowStageDoneHandler}
                    />
                );
            case authStages.PROFILE:
                return (
                    <ProfileCard
                        setIsLoading={setIsLoadingHandler}
                        done={authFlowStageDoneHandler}
                    />
                );
            default:
                return null;
        }
    };

    // Renders the Auth component
    return (
        <div className={styles.auth}>
            {/* Loading HUD (if needed) */}
            {isLoading ? <LoadingHUD message="Loading..." /> : null}

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

// Prop types for the Auth component
Auth.propTypes = {
    /**
     * Lets the parent component know that Authentication is complete
     */
    done: PropTypes.func.isRequired,
};

export default Auth;
