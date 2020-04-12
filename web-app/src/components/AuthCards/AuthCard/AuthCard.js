// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
import { startAuthFlow, changeAuthFlow } from "../../../store/actions/index";

// Style imports
import authCardStyles from "./AuthCard.module.scss";
import authStyles from "../AuthCard.module.scss";

/**
 * Renders the AuthCard component.
 * Handles both sign in and sign up authentication (username and password).
 * @extends {Component}
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class AuthCard extends Component {
    /**
     * AuthCard component state
     * @property {object} formData - Form input values
     * @property {string} formData.email - The email input value
     * @property {string} formData.password - The password input value
     */
    state = {
        formData: {
            email: "",
            password: "",
        },
    };

    /**
     * Indicates whether the component is mounted or not.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     */
    _isMounted = false;

    /**
     * Sets _isMounted to true
     * Starts the auth flow
     */
    componentDidMount() {
        this._isMounted = true;
        this.props.startAuthFlow(
            this.props.authStage === authStages.SIGN_IN
                ? authFlows.SIGN_IN
                : authFlows.SIGN_UP
        );
    }

    /**
     * Checks if a user is authenticated.
     * Changes the auth flow if needed.
     */
    componentDidUpdate(prevProps) {
        this.changeAuthFlowIfNeeded(prevProps);
        this.checkIfUserIsAuthenticated();
    }

    /**
     * Sets _isMounted to false
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Changes the auth flow if needed
     * @function
     * @param {object} prevProps - The previous props object
     */
    changeAuthFlowIfNeeded = (prevProps) => {
        if (
            (prevProps.authStage === authStages.SIGN_IN &&
                this.props.authStage === authStages.SIGN_UP) ||
            (prevProps.authStage === authStages.SIGN_UP &&
                this.props.authStage === authStages.SIGN_IN)
        ) {
            this.props.changeAuthFlow(
                this.props.authStage === authStages.SIGN_IN
                    ? authFlows.SIGN_IN
                    : authFlows.SIGN_UP
            );
        }
    };

    /**
     * Checks if a user is authenticated
     * If a user is authenticated, the proper action is taken.
     * @function
     */
    checkIfUserIsAuthenticated = () => {
        if (this.props.isAuthenticated) {
            // A user is authenticated
            if (this.props.authStage === authStages.SIGN_IN) {
                // Sign in is complete, so this component is done being used
                this.props.setLoading(false);
                this.props.done(authStages.SIGN_IN);
            } else {
                // Sign up is complete, so send an email verification
                this.sendEmailVerification();
            }
        }
    };

    /**
     * Sends an email verification to the current user
     * @function
     */
    sendEmailVerification = () => {
        firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
                // Sign up stage is done
                this.props.setLoading(false);
                this.props.done(authStages.SIGN_UP);
            })
            .catch((error) => {
                authError(
                    error.code,
                    error.message,
                    "[AuthCard/sendEmailVerification]"
                );
                this.props.setLoading(false);
                this.props.showAlert(
                    alertBarTypes.ERROR,
                    "Authentication Error",
                    error.message
                );
            });
    };

    /**
     * Updates state with new text input value
     * @function
     * @param event - The event that called this function
     */
    textInputValueChangedHandler = (event) => {
        const inputName = event.target.name;
        const text = event.target.value;

        // Sets state with new input value
        this.setState((prevState) => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData[inputName] = text;
            return {
                formData: updatedFormData,
            };
        });
    };

    /**
     * Submits the authentication form (sign in or sign up)
     * @function
     * @param event - The event that called this function
     */
    submitHandler = (event) => {
        // Prevents a page reload
        event.preventDefault();

        // Gets email and password values
        const email = this.state.formData.email;
        const password = this.state.formData.password;

        if (this.isEmailValid() && this.isPasswordValid()) {
            if (this.props.authStage === authStages.SIGN_IN) {
                // Sign in
                this.signInWithEmailPassword();
            } else {
                // Sign up
                this.signUpWithEmailPassword(email, password);
            }
        }
    };

    /**
     * Checks if the user's email is valid
     * @function
     * @returns {boolean} Indicates if the email is valid
     */
    isEmailValid = () => {
        const trimmedEmail = this.removeWhitespace(this.state.formData.email);

        if (this.state.formData.email !== trimmedEmail) {
            // Shows an alert and returns false (email is not valid)
            this.props.showAlert(
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
     * @function
     * @returns {boolean} Indicates if the password is valid
     */
    isPasswordValid = () => {
        const trimmedPassword = this.removeWhitespace(
            this.state.formData.password
        );

        if (this.state.formData.password !== trimmedPassword) {
            // Shows an alert and returns false (password is not valid)
            this.props.showAlert(
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
            this.props.showAlert(
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
     * @function
     * @param {string} str - String to transform
     * @returns {string} - A string without whitespace
     */
    removeWhitespace = (str) => str.replace(/\s+/g, "");

    /**
     * Signs the user in with an email and password
     * @function
     */
    signInWithEmailPassword = () => {
        this.props.setLoading(true);

        // If the sign in succeeds, a Firebase observer will create a local copy of the user and alert Redux
        // The Redux state property "isAuthenticated" will cause this component to update
        firebase
            .auth()
            .signInWithEmailAndPassword(
                this.state.formData.email,
                this.state.formData.password
            )
            .catch((error) => {
                authError(
                    error.code,
                    error.message,
                    "[AuthCard/signInWithEmailPassword]"
                );
                this.props.setLoading(false);
                this.props.showAlert(
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
    signUpWithEmailPassword = () => {
        this.props.setLoading(true);

        // If the sign up succeeds, a Firebase observer will create a local copy of the user and alert Redux
        // The Redux state property "isAuthenticated" will cause this component to update
        firebase
            .auth()
            .createUserWithEmailAndPassword(
                this.state.formData.email,
                this.state.formData.password
            )
            .catch((error) => {
                authError(
                    error.code,
                    error.message,
                    "[AuthCard/signUpWithEmailPassword]"
                );
                this.props.setLoading(false);
                this.props.showAlert(
                    alertBarTypes.ERROR,
                    "Sign Up Error",
                    error.message
                );
            });
    };

    /**
     * Gets the component's heading
     * @function
     * @returns {string} A heading
     */
    getHeading = () => {
        return this.props.authStage === authStages.SIGN_IN
            ? "Sign In"
            : "Sign Up";
    };

    /**
     * Gets the form submission button's title
     * @function
     * @returns {string} A title
     */
    getSubmitButtonTitle = () => {
        return this.props.authStage === authStages.SIGN_IN
            ? "Sign In"
            : "Sign Up";
    };

    /**
     * Gets the change auth button's title
     * @function
     * @returns {string} A title
     */
    getChangeAuthButtonTitle = () => {
        return this.props.authStage === authStages.SIGN_IN
            ? "Don't have an account?"
            : "Already have an account?";
    };

    /**
     * Renders the AuthCard component
     */
    render() {
        return (
            <div className={authStyles.authCard}>
                {/* Heading */}
                <h3 className={authStyles.authCardHeading}>
                    {this.getHeading()}
                </h3>

                {/* Auth form */}
                <form
                    className={authStyles.authCardForm}
                    onSubmit={this.submitHandler}
                >
                    {/* Email input */}
                    <div className={authCardStyles.authCardTextInput}>
                        <LargeTextInput
                            inputType={textInputTypes.EMAIL}
                            inputName="email"
                            labelText="Email"
                            value={this.state.formData.email}
                            isRequired={true}
                            onChange={this.textInputValueChangedHandler}
                        />
                    </div>

                    {/* Password input */}
                    <div className={authCardStyles.authCardTextInput}>
                        <LargeTextInput
                            inputType={textInputTypes.PASSWORD}
                            inputName="password"
                            labelText="Password"
                            value={this.state.formData.password}
                            isRequired={true}
                            onChange={this.textInputValueChangedHandler}
                        />
                    </div>

                    {/* Submit button */}
                    <div className={authStyles.authCardSubmitButtonContainer}>
                        <RectangularButton
                            type="submit"
                            value="submit"
                            text={this.getSubmitButtonTitle()}
                            backgroundColor="green"
                        />
                    </div>
                </form>

                {/* A button for switching between auth flows (sign in and sign up) */}
                <div className={authCardStyles.authCardChangeAuth}>
                    <TextButton
                        type="button"
                        value="change-auth"
                        text={this.getChangeAuthButtonTitle()}
                        textColor="blue"
                        center="false"
                        onClick={this.props.switchAuthFlow}
                    />
                </div>
            </div>
        );
    }
}

// Prop types for the AuthCard component
AuthCard.propTypes = {
    /**
     * Indicates if a user is authenticated
     */
    isAuthenticated: PropTypes.bool.isRequired,

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
     * Tells Redux to start the auth flow
     */
    startAuthFlow: PropTypes.func.isRequired,

    /**
     * Tells Redux to change the auth flow
     */
    changeAuthFlow: PropTypes.func.isRequired,

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the AuthCard component as props.
 * This function is used only by the react-redux connect function.
 * @memberof AuthCard
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the AuthCard component
 */
const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

/**
 * Passes certain Redux actions to the AuthCard component as props.
 * This function is used only by the react-redux connect function.
 * @memberof AuthCard
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the AuthCard component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        startAuthFlow: (flow) => dispatch(startAuthFlow(flow)),
        changeAuthFlow: (flow) => dispatch(changeAuthFlow(flow)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthCard);
