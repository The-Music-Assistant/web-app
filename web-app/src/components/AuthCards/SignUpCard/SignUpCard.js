// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/SignUpCard/SignUpCard.js
// Description: Renders the sign up card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import {connect} from 'react-redux';
import * as actions from "../../../store/actions";
import TextInput from "../../FormInputs/TextInput/TextInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import TextButton from "../../Buttons/TextButton/TextButton";
import styles from "./SignUpCard.module.scss";

class SignUpCard extends Component {
    state = {
        formElements: [
            {
                inputType: "email",
                inputName: "email",
                labelText: "Email",
                value: "",
                isRequired: true
            },
            {
                inputType: "password",
                inputName: "password",
                labelText: "Password",
                value: "",
                isRequired: true
            }
        ]
    };

    removeWhitespace = string => string.replace(/\s+/g, "");

    inputValueChangedHandler = (event, index) => {
        const value = event.target.value;
        this.setState(prevState => {
            const updatedFormElements = [...prevState.formElements];
            const updatedInput = { ...prevState.formElements[index] };
            updatedInput.value = value;
            updatedFormElements[index] = updatedInput;
            return {
                formElements: updatedFormElements
            };
        });
    };

    submitHandler = event => {
        event.preventDefault();
        const email = this.state.formElements[0].value;
        const password = this.state.formElements[1].value;
        if (this.isEmailValid(email) && this.isPasswordValid(password)) {
            this.props.signUp(email, password);
        }
    };

    isEmailValid = email => {
        const trimmedEmail = this.removeWhitespace(email);

        if (trimmedEmail !== email) {
            alert("Please remove whitespace from email (e.g. spaces, tabs, etc.)");
            return false;
        }

        return true;
    };

    isPasswordValid = password => {
        const trimmedPassword = this.removeWhitespace(password);

        if (trimmedPassword !== password) {
            alert("Please remove whitespace from password (e.g. spaces, tabs, etc.)");
            return false;
        }

        if (!trimmedPassword.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            console.log(
                trimmedPassword.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            );
            alert(
                `Invalid password. Your password must be at least 8 characters and contain at least one of each: uppercase` +
                    `letter [A-Z], lowercase letter [a-z], number [1-9], and special character [@, $, !, %, *, ?, or &]`
            );
            return false;
        }

        return true;
    };

    render() {
        const formElements = this.state.formElements.map((formElement, index) => {
            return (
                <TextInput
                    key={index}
                    inputType={formElement.inputType}
                    inputName={formElement.inputName}
                    labelText={formElement.labelText}
                    value={formElement.value}
                    isRequired={formElement.isRequired}
                    onChange={event => this.inputValueChangedHandler(event, index)}
                />
            );
        });

        return (
            <div className={styles.authCard}>
                <h3 className={styles.authCardHeading}>Sign Up</h3>
                <form className={styles.authCardForm} onSubmit={this.submitHandler}>
                    {formElements}
                    <div className={styles.authCardButtonContainer}>
                        <RectangularButton
                            type='submit'
                            value='submit'
                            text='Sign Up'
                            backgroundColor='green'
                            center='true'
                        />
                    </div>
                </form>
                <div className={styles.authCardChangeAuth}>
                    <TextButton
                        type='button'
                        value='change-auth'
                        text='Already have an account?'
                        textColor='blue'
                        center='false'
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signUp: (email, password) => dispatch(actions.signUpWithEmailPassword(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpCard);
