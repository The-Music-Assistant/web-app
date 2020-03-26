// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/TextInputs/SmallTextInput/SmallTextInput.js
// Description: Renders the SmallTextInput component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/25/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File inputs
import * as textInputTypes from "../textInputTypes";

// Style imports
import styles from "./SmallTextInput.module.scss";

const SmallTextInput = props => {
    // Returns JSX to display
    return (
        <div className={styles.smallTextInput}>
            <label className={styles.smallTextInputLabel} htmlFor={props.inputName}>
                {`${props.labelText}:`}
            </label>
            <input
                className={styles.smallTextInputInput}
                type={props.inputType}
                name={props.inputName}
                value={props.value}
                onChange={props.onChange}
                required={props.isRequired}
            />
        </div>
    );
};

// SmallTextInput prop types
SmallTextInput.propTypes = {
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

export default SmallTextInput;
