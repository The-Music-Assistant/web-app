// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// File inputs
import * as textInputTypes from "../textInputTypes";

// Style imports
import styles from "./SmallTextInput.module.scss";

/**
 * Renders the SmallTextInput component
 * @component
 * @category FormInputs
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SmallTextInput = ({
    inputType,
    inputName,
    inputWidth,
    value,
    minVal,
    maxVal,
    labelText,
    isRequired,
    onChange,
}) => {
    /**
     * Gets the correct input element
     * @returns An input element (JSX)
     */
    const getInputElement = () => {
        if (inputType === textInputTypes.NUMBER) {
            // Returns a number input with special number type attributes
            return (
                <input
                    className={styles.smallTextInputInput}
                    style={{ width: inputWidth }}
                    type={inputType}
                    name={inputName}
                    value={value}
                    onChange={onChange}
                    required={isRequired}
                    min={minVal}
                    max={maxVal}
                />
            );
        } else {
            // Returns a typical input
            return (
                <input
                    className={styles.smallTextInputInput}
                    style={{ width: inputWidth }}
                    type={inputType}
                    name={inputName}
                    value={value}
                    onChange={onChange}
                    required={isRequired}
                />
            );
        }
    };

    // Returns the JSX to render
    return (
        <div className={styles.smallTextInput}>
            {/* Input label */}
            <label className={styles.smallTextInputLabel} htmlFor={inputName}>
                {`${labelText}:`}
            </label>

            {/* Input */}
            {getInputElement()}
        </div>
    );
};

// Prop types for the SmallTextInput component
SmallTextInput.propTypes = {
    /**
     * The input type to use.
     * Based on the HTML input type attribute.
     * See [types]{@link textInputTypes}
     */
    inputType: PropTypes.oneOf(Object.values(textInputTypes)),

    /**
     * The name of the input
     */
    inputName: PropTypes.string.isRequired,

    /**
     * The width of the component
     */
    inputWidth: PropTypes.string.isRequired,

    /**
     * The value of the input
     */
    value: PropTypes.string.isRequired,

    /**
     * The minimum number allowed.
     * Used for the number inputType.
     */
    minVal: PropTypes.string,

    /**
     * The maximum number allowed.
     * Used for the number inputType.
     */
    maxVal: PropTypes.string,

    /**
     * The input label's text
     */
    labelText: PropTypes.string.isRequired,

    /**
     * Indicates of the input is required as part of the corresponding form
     */
    isRequired: PropTypes.bool.isRequired,

    /**
     * Input change handler
     */
    onChange: PropTypes.func,
};

export default SmallTextInput;
