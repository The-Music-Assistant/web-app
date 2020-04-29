// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File inputs
import * as textInputTypes from "../textInputTypes";

// Style imports
import styles from "./LargeTextInput.module.scss";

/**
 * Renders the LargeTextInput component
 * @component
 * @category FormInputs
 * @author Dan Levy <danlevy124@gmail.com>
 */
const LargeTextInput = (props) => {
    // Gets the list of class names for the input element
    let inputClassNames = `${styles.input}`;
    if (props.value.length > 0) {
        inputClassNames += ` ${styles.inputValid}`;
    }

    // Returns the JSX to render
    return (
        <div className={styles.inputContainer}>
            {/* Input element */}
            <input
                className={inputClassNames}
                type={props.inputType}
                name={props.inputName}
                value={props.value}
                onChange={props.onChange}
                required={props.isRequired}
            />

            {/* Input label element */}
            <label className={styles.label} htmlFor={props.inputName}>
                <span className={styles.content}>{props.labelText}</span>
            </label>
        </div>
    );
};

// LargeTextInput prop types
LargeTextInput.propTypes = {
    /**
     * The input type to use.
     * Based on the HTML input type attribute.
     * See [types]{@link textInputTypes}
     */
    inputType: PropTypes.oneOf(Object.values(textInputTypes)),

    /**
     * The name of the input
     */
    inputName: PropTypes.string,

    /**
     * The value of the input
     */
    value: PropTypes.string,

    /**
     * The input label's text
     */
    labelText: PropTypes.string,

    /**
     * Indicates of the input is required as part of the corresponding form
     */
    isRequired: PropTypes.bool,

    /**
     * Input change handler
     */
    onChange: PropTypes.func,
};

export default LargeTextInput;
