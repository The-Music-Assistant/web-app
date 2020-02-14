// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/ImageInput/ImageInput.js
// Description: Renders the image input component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/6/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./ImageInput.module.scss";

const ImageInput = props => {
    // Returns JSX to display
    return (
        <div>
            <input
                id={props.inputName}
                className={styles.imageInput}
                type='file'
                name={props.inputName}
                accept='image/*'
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

// ImageInput prop types
ImageInput.propTypes = {
    inputName: PropTypes.string,
    buttonName: PropTypes.string,
    file: PropTypes.object,
    isRequired: PropTypes.bool,
    onChange: PropTypes.func
};

export default ImageInput;
