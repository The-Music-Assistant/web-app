// ----------------------------------------------------------------------------
// File Path: src/components/Buttons/RectangularButton/RectangularButton.js
// Description: Renders the rectangular button component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/5/2020
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./RectangularButton.module.scss";

const Button = props => {
    const classNames = [styles.rectButton];
    classNames.push(styles[`${props.backgroundColor}RectButton`]);
    if (props.center === "true") {
        classNames.push(styles.centerRectButton);
    }
    return (
        <button className={classNames.join(" ")} type={props.type} value={props.value}>
            {props.text}
        </button>
    );
};

export default Button;
