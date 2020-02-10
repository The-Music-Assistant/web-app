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
    return (
        <button className={classNames.join(" ")} type={props.type} value={props.value} onClick={props.onClick}>
            {props.text}
        </button>
    );
};

export default Button;
