// NPM module imports
import React, { Fragment } from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./ImageInput.module.scss";

/**
 * Renders the ImageInput component.
 * Allows the user to select an image from their file system.
 * @component
 * @category FormInputs
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ImageInput = ({ inputName, buttonTitle, file, isRequired, onChange }) => {
    return (
        <Fragment>
            {/* File input */}
            {/* NOTE: The input element is hidden (only the label is displayed) */}
            <input
                id={inputName}
                type="file"
                name={inputName}
                accept="image/*"
                hidden
                onChange={onChange}
                files={file}
                required={isRequired}
            />

            {/* File input label */}
            <label className={styles.imageInputLabel} htmlFor={inputName}>
                {buttonTitle}
            </label>
        </Fragment>
    );
};

// Prop types for the ImageInput component
ImageInput.propTypes = {
    /**
     * The name for the input
     */
    inputName: PropTypes.string.isRequired,

    /**
     * The button title
     */
    buttonTitle: PropTypes.string.isRequired,

    /**
     * The file that is associated with this input
     */
    file: PropTypes.object,

    /**
     * Indicates if this input is required as part of its associated form
     */
    isRequired: PropTypes.bool.isRequired,

    /**
     * On input change handler
     */
    onChange: PropTypes.func.isRequired,
};

export default ImageInput;
