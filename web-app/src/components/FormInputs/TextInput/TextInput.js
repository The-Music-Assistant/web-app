// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/TextInput/TextInput.js
// Description: Renders the text input component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/5/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File inputs
import * as textInputTypes from "./textInputTypes";

// Style imports
import styles from "./TextInput.module.scss";

const TextInput = props => {
    // List of class names to attact to the text input
    const inputClassNames = [styles.input];
    if (props.value.length > 0) {
        inputClassNames.push(styles.inputValid);
    }

    // Returns JSX to display
    return (
        <div className={styles.inputContainer}>
            <input
                className={inputClassNames.join(" ")}
                type={props.inputType}
                name={props.inputName}
                value={props.value}
                onChange={props.onChange}
                required={props.isRequired}
            />
            <label className={styles.label} htmlFor={props.inputName}>
                <span className={styles.content}>{props.labelText}</span>
            </label>
        </div>
    );
};

// TextInput prop types
TextInput.propTypes = {
    inputType: PropTypes.oneOf([
        textInputTypes.TEXT,
        textInputTypes.EMAIL,
        textInputTypes.PASSWORD,
        textInputTypes.NUMBER,
        textInputTypes.TEL,
        textInputTypes.URL
    ]),
    inputName: PropTypes.string,
    value: PropTypes.string,
    labelText: PropTypes.string,
    isRequired: PropTypes.bool,
    onChange: PropTypes.func
};

export default TextInput;
