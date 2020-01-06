// ----------------------------------------------------------------------------
// File Path: src/components/TextButton/TextButton.js
// Description: Renders the text button component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/5/2020
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./TextButton.module.scss";

const TextButton = props => {
    const classNames = [styles.textButton];
    classNames.push(styles[`${props.textColor}TextButton`]);
    if (classNames.center === "true") {
        classNames.push(styles.centerTextButton);
    }
    return (
        <button className={classNames.join(" ")} type={props.type} value={props.value}>
            {props.text}
        </button>
    );
};

export default TextButton;
