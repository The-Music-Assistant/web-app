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
                style={{ width: props.inputWidth }}
                type={props.inputType}
                name={props.inputName}
                value={props.value}
                onChange={props.onChange}
                required={props.isRequired}
                min={props.minVal}
                max={props.maxVal}
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
    inputWidth: PropTypes.string.isRequired,
    minVal: PropTypes.number,
    maxVal: PropTypes.number,
    inputName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    isRequired: PropTypes.bool.isRequired,
    onChange: PropTypes.func
};

export default SmallTextInput;
