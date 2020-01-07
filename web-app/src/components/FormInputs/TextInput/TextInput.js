// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/TextInput/TextInput.js
// Description: Renders the text input component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/5/2020
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./TextInput.module.scss";

const TextInput = props => {
    const inputClassNames = [styles.input];
    if (props.value.length > 0) {
        inputClassNames.push(styles.inputValid);
    }

    const inputElement = (
        <input
            className={inputClassNames.join(" ")}
            type={props.inputType}
            name={props.inputName}
            value={props.value}
            onChange={props.onChange}
            required={props.isRequired}
        />
    );

    const inputContainerClassNames = [styles.inputContainer];
    if (props.addBottomMargin) {
        inputContainerClassNames.push(styles.inputContainerMarginBottom);
    }

    return (
        <div className={inputContainerClassNames.join(" ")}>
            {inputElement}
            <label className={styles.label} htmlFor={props.inputName}>
                <span className={styles.content}>{props.labelText}</span>
            </label>
        </div>
    );
};

export default TextInput;
