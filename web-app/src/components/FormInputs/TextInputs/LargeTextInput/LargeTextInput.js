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
const LargeTextInput = ({
    inputType,
    inputName,
    value,
    labelText,
    isRequired,
    onChange,
}) => {
    // Gets the list of class names for the input element
    let inputClassNames = `${styles.input}`;
    if (value.length > 0) {
        inputClassNames += ` ${styles.inputValid}`;
    }

    // Returns the JSX to render
    return (
        <div className={styles.inputContainer}>
            {/* Input element */}
            <input
                className={inputClassNames}
                type={inputType}
                name={inputName}
                value={value}
                onChange={onChange}
                required={isRequired}
            />

            {/* Input label element */}
            <label className={styles.label} htmlFor={inputName}>
                <span className={styles.content}>{labelText}</span>
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
