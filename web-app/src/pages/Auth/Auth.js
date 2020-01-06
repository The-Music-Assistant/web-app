// ----------------------------------------------------------------------------
// File Path: src/pages/Auth/Auth.js
// Description: Renders the auth page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/3/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import * as actions from "../../store/actions";
import TextInput from "../../components/TextInput/TextInput";
import RectangularButton from "../../components/RectangularButton/RectangularButton";
import TextButton from "../../components/TextButton/TextButton";
import styles from "./Auth.module.scss";
import logo from "../../assets/logos/music-assistant-logo.png";

class Auth extends Component {
    state = {
        formElements: [
            {
                inputType: "email",
                inputName: "email",
                labelText: "Email",
                value: "",
                isRequired: true,
                addBottomMargin: true
            },
            {
                inputType: "password",
                inputName: "password",
                labelText: "Password",
                value: "",
                isRequired: true,
                classNames: [],
                addBottomMargin: true
            }
        ]
    };

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
        console.log(this.state.formElements);
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
                    classNames={formElement.classNames}
                    addBottomMargin={formElement.addBottomMargin}
                    onChange={event => this.inputValueChangedHandler(event, index)}
                />
            );
        });

        return (
            <div className={styles.auth}>
                <div className={styles.authContainer}>
                    <div className={styles.authInfo}>
                        <img
                            className={styles.authInfoLogo}
                            src={logo}
                            alt='Music Assistant Logo'
                        />
                        <h1 className={styles.authInfoHeading}>
                            Welcome to
                            <br />
                            The Music Assistant
                        </h1>
                        <h2 className={styles.authInfoSubheading}>
                            Your gateway to better singing
                        </h2>
                    </div>
                    <div className={styles.authCard}>
                        <h3 className={styles.authCardHeading}>Sign Up</h3>
                        <form className={styles.authCardForm} onSubmit={this.submitHandler}>
                            {formElements}
                            <RectangularButton
                                type='submit'
                                value='submit'
                                text='Sign Up'
                                backgroundColor='green'
                                center='true'
                            />
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
                </div>
            </div>
        );
    }
}

export default Auth;
