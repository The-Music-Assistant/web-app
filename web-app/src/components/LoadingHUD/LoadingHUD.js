// ----------------------------------------------------------------------------
// File Path: src/components/LoadingModal/LoadingHUD.js
// Description: Renders the loading HUD component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/18/2020
// ----------------------------------------------------------------------------

import React from "react";
import { MetroSpinner } from "react-spinners-kit";
import styles from "./LoadingHUD.module.scss";

const LoadingHUD = props => {
    return (
        <div className={styles.background}>
            <div className={styles.modal}>
                <MetroSpinner size={50} color='#5f9cd1' loading={true} />
                <h3 className={styles.modalText}>{props.text}</h3>
            </div>
        </div>
    );
};

export default LoadingHUD;
