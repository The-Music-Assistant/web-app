// ----------------------------------------------------------------------------
// File Path: src/components/FormInputs/ImageUpload/ImageUpload.js
// Description: Renders the image upload component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/6/2020
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./ImageUpload.module.scss";

const ImageUpload = props => {
    return (
        <div>
            <input id={props.inputName} className={styles.imageUpload} type='file' name={props.inputName} accept='image/*' hidden onChange={props.onChange} />
            <label className={styles.imageUploadLabel} htmlFor={props.inputName}>{props.buttonName}</label>
        </div>
    );
};

export default ImageUpload;