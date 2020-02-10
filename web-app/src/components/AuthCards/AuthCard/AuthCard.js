// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/AuthCard/AuthCard.js
// Description
//      * Renders the auth card component
//      * The auth card handles both sign in and sign up
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../../vendors/Firebase/firebase";
import { startSignIn, startSignUp } from "../../../store/actions";
import TextInput from "../../FormInputs/TextInput/TextInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import TextButton from "../../Buttons/TextButton/TextButton";
import authCardStyles from "./AuthCard.module.scss";
import authStyles from "../AuthCard.module.scss";
import { SIGN_IN, SIGN_UP } from "../../../pages/Auth/authCards";
import * as authFlows from "../../../pages/Auth/authFlows";

class AuthCard extends Component {
    state = {
        formData: {
            email: "",
            password: ""
        }
    };

    componentDidUpdate() {
        if (this.props.isAuthenticated && this.props.authFlow === authFlows.SIGN_UP) {
            this.sendEmailVerification();
        }
    }

    removeWhitespace = string => string.replace(/\s+/g, "");

    textInputValueChangedHandler = event => {
        const inputName = event.target.name;
        const text = event.target.value;
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData[inputName] = text;
            return {
                formData: updatedFormData
            };
        });
    };

    submitHandler = event => {
        event.preventDefault();
        const email = this.state.formData.email;
        const password = this.state.formData.password;
        if (this.isEmailValid(email) && this.isPasswordValid(password)) {
            if (this.props.authFlow === authFlows.SIGN_IN) {
                this.signInWithEmailPassword(email, password, true);
            } else {
                this.signUpWithEmailPassword(email, password);
            }
        }
    };

    isEmailValid = email => {
        const trimmedEmail = this.removeWhitespace(email);

        if (trimmedEmail !== email) {
            this.props.showAlert(
                "error",
                "Email Error",
                "Please remove whitespace from email (e.g. spaces, tabs, etc.)"
            );
            return false;
        }

        return true;
    };

    isPasswordValid = password => {
        const trimmedPassword = this.removeWhitespace(password);

        if (trimmedPassword !== password) {
            this.props.showAlert(
                "error",
                "Password Error",
                "Please remove whitespace from password (e.g. spaces, tabs, etc.)"
            );
            return false;
        }

        if (!trimmedPassword.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            this.props.showAlert(
                "error",
                "Password Error",
                "Invalid password. Your password must be at least 8 characters and contain at least one of each: uppercase letter [A-Z], lowercase letter [a-z], number [1-9], and special character [@, $, !, %, *, ?, or &]"
            );
            return false;
        }

        return true;
    };

    /**
     * Signs the user up with an email and password
     * Sends an email verification
     * @param {string} email - User's email
     * @param {string} password - User's password
     */
    signUpWithEmailPassword = (email, password) => {
        this.props.setLoading(true);
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => {
                this.props.setLoading(false);
                this.props.showAlert("error", "Sign Up Error", error.message);
            });
    };

    /**
     * Signs the user in with an email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @param {boolean} stayAuthenticated - Whether or not to hold auth state when the session ends
     */
    signInWithEmailPassword = (email, password, stayAuthenticated) => {
        this.props.setLoading(true);
        const persistenceType = stayAuthenticated
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;

        firebase
            .auth()
            .setPersistence(persistenceType)
            .catch(error => {
                console.log(error);
            })
            .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
            .then(() => {
                this.props.setLoading(false);
                this.props.done(SIGN_IN);
            })
            .catch(error => {
                console.log(error);
                this.props.setLoading(false);
                this.props.showAlert("error", "Authentication Error", error.message);
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
                this.props.setLoading(false);
                this.props.done(SIGN_UP);
            })
            .catch(error => {
                this.props.setLoading(false);
                this.props.showAlert("error", "Authentication Error", error.message);
            });
    };

    changeAuthHandler = () => {
        if (this.props.authFlow === authFlows.SIGN_IN) {
            this.props.startSignUp();
        } else {
            this.props.startSignIn();
        }
    };

    render() {
        let heading;
        let submitButtonTitle;
        let changeAuthButtonTitle;

        if (this.props.authFlow === authFlows.SIGN_IN) {
            heading = "Sign In";
            submitButtonTitle = "Sign In";
            changeAuthButtonTitle = "Don't have an account?";
        } else {
            heading = "Sign Up";
            submitButtonTitle = "Sign Up";
            changeAuthButtonTitle = "Already have an account?";
        }

        return (
            <div className={authStyles.authCard}>
                <h3 className={authStyles.authCardHeading}>{heading}</h3>
                <form className={authStyles.authCardForm} onSubmit={this.submitHandler}>
                    <TextInput
                        inputType='email'
                        inputName='email'
                        labelText='Email'
                        value={this.state.formData.email}
                        isRequired={true}
                        onChange={this.textInputValueChangedHandler}
                    />
                    <TextInput
                        inputType='password'
                        inputName='password'
                        labelText='Password'
                        value={this.state.formData.password}
                        isRequired={true}
                        onChange={this.textInputValueChangedHandler}
                    />

                    <div className={authStyles.authCardSubmitButtonContainer}>
                        <RectangularButton
                            type='submit'
                            value='submit'
                            text={submitButtonTitle}
                            backgroundColor='green'
                        />
                    </div>
                </form>
                <div className={authCardStyles.signUpCardChangeAuth}>
                    <TextButton
                        type='button'
                        value='change-auth'
                        text={changeAuthButtonTitle}
                        textColor='blue'
                        center='false'
                        onClick={this.changeAuthHandler}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authFlow: state.auth.authFlow
    };
};

const mapDispatchToProps = dispatch => {
    return {
        startSignIn: () => dispatch(startSignIn()),
        startSignUp: () => dispatch(startSignUp())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthCard);
