// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/ImageInput/ImageInput.js
// Description: Renders the image input component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/6/2020
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./ImageInput.module.scss";

const ImageInput = props => {
    return (
        <div>
            <input id={props.inputName} className={styles.imageInput} type='file' name={props.inputName} accept='image/*' hidden onChange={props.onChange} files={props.file} />
            <label className={styles.imageInputLabel} htmlFor={props.inputName}>{props.buttonName}</label>
        </div>
    );
};

export default ImageInput;