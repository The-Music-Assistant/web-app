// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./ImageInput.module.scss";

/**
 * Renders the ImageInput component.
 * Allows the user to select an image from their file system.
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ImageInput = (props) => {
    return (
        <div>
            <input
                id={props.inputName}
                className={styles.imageInput}
                type="file"
                name={props.inputName}
                accept="image/*"
                hidden
                onChange={props.onChange}
                files={props.file}
                required={props.isRequired}
            />
            <label className={styles.imageInputLabel} htmlFor={props.inputName}>
                {props.buttonName}
            </label>
        </div>
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
