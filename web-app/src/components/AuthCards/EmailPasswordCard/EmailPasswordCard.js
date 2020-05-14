// NPM module imports
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

// Component imports
import LargeTextInput from "../../FormInputs/TextInputs/LargeTextInput/LargeTextInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import TextButton from "../../Buttons/TextButton/TextButton";

// File imports
import firebase from "../../../vendors/Firebase/firebase";
import { authError } from "../../../vendors/Firebase/logs";
import * as authStages from "../../../pages/Auth/authStages";
import * as authFlows from "../../../pages/Auth/authFlows";
import * as alertBarTypes from "../../AlertBar/alertBarTypes";
import * as textInputTypes from "../../FormInputs/TextInputs/textInputTypes";
import { startAuthFlow } from "../../../store/actions/index";

// Style imports
import emailPasswordCardStyles from "./EmailPasswordCard.module.scss";
import authCardStyles from "../AuthCard.module.scss";

/**
 * Renders the EmailPasswordCard component.
 * Handles both sign in and sign up authentication (username and password).
 * @component
 * @category AuthCards
 * @author Dan Levy <danlevy124@gmail.com>
 */
const EmailPasswordCard = ({
    authStage,
    showAlert,
    setLoading,
    done,
    switchAuthFlow,
}) => {
    /**
     * The email input value
     * {[email, setEmail]: [string, function]}
     */
    const [email, setEmail] = useState("");

    /**
     * The password input value
     * {[password, setPassword]: [string, function]}
     */
    const [password, setPassword] = useState("");

    /**
     * Indicates if a user is authenticated
     * @type {boolean}
     */
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    /**
     * react-redux dispatch function
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Sets isMounted to true.
     * Starts the auth flow.
     */
    useEffect(() => {
        dispatch(
            startAuthFlow(
                authStage === authStages.SIGN_IN
                    ? authFlows.SIGN_IN
                    : authFlows.SIGN_UP
            )
        );
    }, [dispatch, authStage]);

    /**
     * Sends an email verification to the current user
     */
    const sendEmailVerification = useCallback(() => {
        firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
                // Sign up stage is done
                setLoading(false);
                done(authStages.SIGN_UP);
            })
            .catch((error) => {
                authError(
                    error.code,
                    error.message,
                    "[EmailPasswordCard/sendEmailVerification]"
                );
                setLoading(false);
                showAlert(
                    alertBarTypes.ERROR,
                    "Authentication Error",
                    error.message
                );
            });
    }, [setLoading, done, showAlert]);

    /**
     * Checks if a user is authenticated
     * If a user is authenticated, the proper action is taken.
     */
    const checkIfUserIsAuthenticated = useCallback(() => {
        if (isAuthenticated) {
            // A user is authenticated
            if (authStage === authStages.SIGN_IN) {
                // Sign in is complete, so this component is done being used
                setLoading(false);
                done(authStages.SIGN_IN);
            } else {
                // Sign up is complete, so send an email verification
                sendEmailVerification();
            }
        }
    }, [isAuthenticated, authStage, setLoading, done, sendEmailVerification]);

    /**
     * Checks if a user is authenticated.
     * Changes the auth flow if needed.
     */
    useEffect(() => {
        checkIfUserIsAuthenticated();
    }, [checkIfUserIsAuthenticated]);

    /**
     * Submits the authentication form (sign in or sign up)
     * @param event - The event that called this function
     */
    const submitHandler = (event) => {
        // Prevents a page reload
        event.preventDefault();

        if (isEmailValid() && isPasswordValid()) {
            if (authStage === authStages.SIGN_IN) {
                // Sign in
                signInWithEmailPassword();
            } else {
                // Sign up
                signUpWithEmailPassword();
            }
        }
    };

    /**
     * Checks if the user's email is valid
     * @returns {boolean} Indicates if the email is valid
     */
    const isEmailValid = () => {
        const trimmedEmail = removeWhitespace(email);

        if (email !== trimmedEmail) {
            // Shows an alert and returns false (email is not valid)
            showAlert(
                alertBarTypes.ERROR,
                "Email Error",
                "Please remove whitespace from your email (e.g. spaces, tabs, etc.)"
            );
            return false;
        }

        // Email has no whitespace (valid)
        return true;
    };

    /**
     * Checks if the user's password is valid
     * @returns {boolean} Indicates if the password is valid
     */
    const isPasswordValid = () => {
        const trimmedPassword = removeWhitespace(password);

        if (password !== trimmedPassword) {
            // Shows an alert and returns false (password is not valid)
            showAlert(
                alertBarTypes.ERROR,
                "Password Error",
                "Please remove whitespace from your password (e.g. spaces, tabs, etc.)"
            );
            return false;
        }

        // Regex states that a password must have
        // 8 characters with at least one of each of the following
        // 1 uppercase letter
        // 1 lowercase letter
        // 1 number (0-9)
        // 1 special character (!, @, #, $, %, ^, &, *, or -)
        if (
            !trimmedPassword.match(
                /^(?=.*\d)(?=.*[!@#$%^&*-])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            )
        ) {
            showAlert(
                alertBarTypes.ERROR,
                "Password Error",
                `Invalid password. Your password must be at least 8 characters long and contain at least one of each: 
                uppercase letter [A-Z], lowercase letter [a-z], number [1-9], and special character [!, @, #, $, %, ^, &, *, or -]`
            );
            return false;
        }

        // Email has no whitespace and passes security requirements (valid)
        return true;
    };

    /**
     * Removes whitespace from a string
     * @param {string} str - String to transform
     * @returns {string} - A string without whitespace
     */
    const removeWhitespace = (str) => str.replace(/\s+/g, "");

    /**
     * Signs the user in with an email and password
     */
    const signInWithEmailPassword = () => {
        setLoading(true);

        // If the sign in succeeds, a Firebase observer will create a local copy of the user and alert Redux
        // The Redux state property "isAuthenticated" will cause this component to update
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                authError(
                    error.code,
                    error.message,
                    "[EmailPasswordCard/signInWithEmailPassword]"
                );
                setLoading(false);
                showAlert(
                    alertBarTypes.ERROR,
                    "Authentication Error",
                    error.message
                );
            });
    };

    /**
     * Signs the user up with an email and password
     * @function
     */
    const signUpWithEmailPassword = () => {
        setLoading(true);

        // If the sign up succeeds, a Firebase observer will create a local copy of the user and alert Redux
        // The Redux state property "isAuthenticated" will cause this component to update
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch((error) => {
                authError(
                    error.code,
                    error.message,
                    "[EmailPasswordCard/signUpWithEmailPassword]"
                );
                setLoading(false);
                showAlert(alertBarTypes.ERROR, "Sign Up Error", error.message);
            });
    };

    /**
     * Gets the component's heading
     * @returns {string} A heading
     */
    const getAuthTypeString = () => {
        return authStage === authStages.SIGN_IN ? "Sign In" : "Sign Up";
    };

    /**
     * Gets the change auth button's title
     * @returns {string} A title
     */
    const getChangeAuthButtonTitle = () => {
        return authStage === authStages.SIGN_IN
            ? "Don't have an account?"
            : "Already have an account?";
    };

    // Renders the EmailPasswordCard component
    return (
        <section className={authCardStyles.authCard}>
            {/* Heading */}
            <h3 className={authCardStyles.authCardHeading}>
                {getAuthTypeString()}
            </h3>

            {/* Auth form */}
            <form
                className={authCardStyles.authCardForm}
                onSubmit={submitHandler}
            >
                {/* Email input */}
                <div
                    className={
                        emailPasswordCardStyles.emailPasswordCardFormTextInput
                    }
                >
                    <LargeTextInput
                        inputType={textInputTypes.EMAIL}
                        inputName="email"
                        labelText="Email"
                        value={email}
                        isRequired={true}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                {/* Password input */}
                <div
                    className={
                        emailPasswordCardStyles.emailPasswordCardFormTextInput
                    }
                >
                    <LargeTextInput
                        inputType={textInputTypes.PASSWORD}
                        inputName="password"
                        labelText="Password"
                        value={password}
                        isRequired={true}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                {/* Submit button */}
                <div className={authCardStyles.authCardFormSubmitButton}>
                    <RectangularButton
                        type="submit"
                        value="submit"
                        title={getAuthTypeString()}
                        backgroundColor="green"
                    />
                </div>
            </form>

            {/* A button for switching between auth flows (sign in and sign up) */}
            <div
                className={
                    emailPasswordCardStyles.emailPasswordCardChangeAuthFlowButton
                }
            >
                <TextButton
                    type="button"
                    value="change-auth"
                    text={getChangeAuthButtonTitle()}
                    textColor="blue"
                    center="false"
                    onClick={switchAuthFlow}
                />
            </div>
        </section>
    );
};

// Prop types for the EmailPasswordCard component
EmailPasswordCard.propTypes = {
    /**
     * The current auth stage.
     * See [stages]{@link module:authStages}.
     */
    authStage: PropTypes.oneOf([authStages.SIGN_IN, authStages.SIGN_UP])
        .isRequired,

    /**
     * Tells Redux to show/hide the loading HUD (true for show and false for hide (i.e. remove))
     */
    setLoading: PropTypes.func.isRequired,

    /**
     * Tells Redux to show an alert
     */
    showAlert: PropTypes.func.isRequired,

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,
};

export default EmailPasswordCard;
