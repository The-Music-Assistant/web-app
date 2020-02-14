// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/AuthCard/AuthCard.js
// Description
//      * Renders the auth card component
//      * The auth card handles both sign in and sign up
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Component imports
import TextInput from "../../FormInputs/TextInput/TextInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import TextButton from "../../Buttons/TextButton/TextButton";

// File imports
import firebase from "../../../vendors/Firebase/firebase";
import * as authStages from "../../../pages/Auth/authStages";
import * as alertBarTypes from "../../AlertBar/alertBarTypes";
import * as textInputTypes from "../../FormInputs/TextInput/textInputTypes";

// Style imports
import authCardStyles from "./AuthCard.module.scss";
import authStyles from "../AuthCard.module.scss";

class AuthCard extends Component {
    // Component state
    // formData holds form input values
    state = {
        formData: {
            email: "",
            password: ""
        }
    };

    /**
     * Checks isAuthenticated Redux state
     */
    componentDidUpdate() {
        // Catches Redux state change when Firebase auth handler finishes
        if (this.props.isAuthenticated) {
            if (this.props.authStage === authStages.SIGN_IN) {
                // Sign in is complete
                this.props.setLoading(false);
                this.props.done(authStages.SIGN_IN);
            } else {
                // Sign up is complete, but still need to send email verification
                this.sendEmailVerification();
            }
        }
    }

    /**
     * Removes whitespace from a string
     * @param {string} str - String to transform
     * @returns - A string without whitespace
     */
    removeWhitespace = str => str.replace(/\s+/g, "");

    /**
     * Updates form data state with new text input value
     * @param {object} event - The event (text input) that triggered this method
     */
    textInputValueChangedHandler = event => {
        const inputName = event.target.name;
        const text = event.target.value;

        // Sets state with new input value
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData[inputName] = text;
            return {
                formData: updatedFormData
            };
        });
    };

    /**
     * Submits the authentication form (sign in or sign up)
     * @param {object} event - The event (button) that triggered this method
     */
    submitHandler = event => {
        // Prevents page reload
        event.preventDefault();

        // Gets email and password values
        const email = this.state.formData.email;
        const password = this.state.formData.password;

        if (this.isEmailValid(email) && this.isPasswordValid(password)) {
            // If email and password are valid, sign in or sign up with Firebase
            if (this.props.authStage === authStages.SIGN_IN) {
                this.signInWithEmailPassword(email, password);
            } else {
                this.signUpWithEmailPassword(email, password);
            }
        }
    };

    /**
     * Checks if the given email is valid
     * @param {string} email - The email to check
     * @returns - A boolean representing whether the email is valid or not
     */
    isEmailValid = email => {
        // Removes whitespace from email
        const trimmedEmail = this.removeWhitespace(email);

        if (trimmedEmail !== email) {
            // If email has whitespace, show an alert and return false (not valid)
            this.props.showAlert(
                alertBarTypes.ERROR,
                "Email Error",
                "Please remove whitespace from email (e.g. spaces, tabs, etc.)"
            );
            return false;
        }

        // Email has no whitespace (valid)
        return true;
    };

    /**
     * Checks if the given password is valid
     * @param {string} password - The password to check
     * @returns - A boolean representing whether the password is valid or not
     */
    isPasswordValid = password => {
        // Removes whitespace from email
        const trimmedPassword = this.removeWhitespace(password);

        if (trimmedPassword !== password) {
            // If password has whitespace, show an alert and return false (not valid)
            this.props.showAlert(
                alertBarTypes.ERROR,
                "Password Error",
                "Please remove whitespace from password (e.g. spaces, tabs, etc.)"
            );
            return false;
        }

        // Regex states that password must have
        // 8 characters with at least one of each of the following
        // 1 lowercase letter
        // 1 uppercase letter
        // 1 number (0-9)
        // 1 special character (!, @, #, $, %, ^, &, *, or -)
        if (!trimmedPassword.match(/^(?=.*\d)(?=.*[!@#$%^&*-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            // If the password doesn't meet security requirements, show and alert and return false (not valid)
            this.props.showAlert(
                alertBarTypes.ERROR,
                "Password Error",
                `Invalid password. Your password must be at least 8 characters and contain at least one of each: 
                uppercase letter [A-Z], lowercase letter [a-z], number [1-9], and special character [@, $, !, %, *, ?, or &]`
            );
            return false;
        }

        // Email has no whitespace and passes security requirements (valid)
        return true;
    };

    /**
     * Signs the user in with an email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    signInWithEmailPassword = (email, password) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.log("[AuthCard/signInWithEmailPassword]", error);
                this.props.setLoading(false);
                this.props.showAlert(alertBarTypes.ERROR, "Authentication Error", error.message);
            });
    };

    /**
     * Signs the user up with an email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    signUpWithEmailPassword = (email, password) => {
        this.props.setLoading(true);

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => {
                console.log("[AuthCard/signUpWithEmailPassword]", error);
                this.props.setLoading(false);
                this.props.showAlert(alertBarTypes.ERROR, "Sign Up Error", error.message);
            });
    };

    /**
     * Sends an email verification to the current user
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
            .catch(error => {
                console.log("[AuthCard/sendEmailVerification]", error);
                this.props.setLoading(false);
                this.props.showAlert(alertBarTypes.ERROR, "Authentication Error", error.message);
            });
    };

    /**
     * Renders the auth card component
     * The component consists of
     * A heading
     * A form containing an email field, password field, and submit button
     * A text button for switching between auth flows (sign in and sign up)
     */
    render() {
        let heading;
        let submitButtonTitle;
        let changeAuthButtonTitle;

        // Sets heading and button titles depending on auth flow (sign in or sign up)
        if (this.props.authStage === authStages.SIGN_IN) {
            heading = "Sign In";
            submitButtonTitle = "Sign In";
            changeAuthButtonTitle = "Don't have an account?";
        } else {
            heading = "Sign Up";
            submitButtonTitle = "Sign Up";
            changeAuthButtonTitle = "Already have an account?";
        }

        // Returns the JSX to display
        return (
            <div className={authStyles.authCard}>
                <h3 className={authStyles.authCardHeading}>{heading}</h3>
                <form className={authStyles.authCardForm} onSubmit={this.submitHandler}>
                    <div className={authCardStyles.authCardTextInput}>
                        <TextInput
                            inputType={textInputTypes.EMAIL}
                            inputName='email'
                            labelText='Email'
                            value={this.state.formData.email}
                            isRequired={true}
                            onChange={this.textInputValueChangedHandler}
                        />
                    </div>
                    <div className={authCardStyles.authCardTextInput}>
                        <TextInput
                            inputType={textInputTypes.PASSWORD}
                            inputName='password'
                            labelText='Password'
                            value={this.state.formData.password}
                            isRequired={true}
                            onChange={this.textInputValueChangedHandler}
                        />
                    </div>

                    <div className={authStyles.authCardSubmitButtonContainer}>
                        <RectangularButton
                            type='submit'
                            value='submit'
                            text={submitButtonTitle}
                            backgroundColor='green'
                        />
                    </div>
                </form>
                <div className={authCardStyles.authCardChangeAuth}>
                    <TextButton
                        type='button'
                        value='change-auth'
                        text={changeAuthButtonTitle}
                        textColor='blue'
                        center='false'
                        onClick={this.props.switchAuthFlow}
                    />
                </div>
            </div>
        );
    }
}

/**
 * Gets the current state from Redux and passes it to AuthCard as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

// Prop types for the AuthCard component
AuthCard.propTypes = {
    isAuthenticated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
    authStage: PropTypes.oneOf([authStages.SIGN_IN, authStages.SIGN_UP, authStages.PROFILE])
        .isRequired,
    setLoading: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(AuthCard);
