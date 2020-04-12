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
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SmallTextInput = (props) => {
    /**
     * Gets the correct input element
     * @returns An input element (JSX)
     */
    const getInputElement = () => {
        if (props.inputType === textInputTypes.NUMBER) {
            // Returns a number input with special number type attributes
            return (
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
            );
        } else {
            // Returns a typical input
            return (
                <input
                    className={styles.smallTextInputInput}
                    style={{ width: props.inputWidth }}
                    type={props.inputType}
                    name={props.inputName}
                    value={props.value}
                    onChange={props.onChange}
                    required={props.isRequired}
                />
            );
        }
    };

    // Returns the JSX to render
    return (
        <div className={styles.smallTextInput}>
            {/* Input label */}
            <label
                className={styles.smallTextInputLabel}
                htmlFor={props.inputName}
            >
                {`${props.labelText}:`}
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
    inputType: PropTypes.oneOf([
        textInputTypes.TEXT,
        textInputTypes.EMAIL,
        textInputTypes.PASSWORD,
        textInputTypes.NUMBER,
        textInputTypes.TEL,
        textInputTypes.URL,
    ]),

    /**
     * The width of the component
     */
    inputWidth: PropTypes.string.isRequired,

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
     * The name of the input
     */
    inputName: PropTypes.string.isRequired,

    /**
     * The value of the input
     */
    value: PropTypes.string.isRequired,

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
