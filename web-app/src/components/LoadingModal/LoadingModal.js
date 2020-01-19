// ----------------------------------------------------------------------------
// File Path: src/components/LoadingModal/LoadingModal.js
// Description: Renders the loading modal component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/18/2020
// ----------------------------------------------------------------------------

import React from "react";
import { MetroSpinner } from "react-spinners-kit";
import styles from "./LoadingModal.module.scss";

const LoadingModal = props => {
    return (
        <div className={styles.background}>
            <div className={styles.modal}>
                <MetroSpinner size={50} color='#5f9cd1' loading={true} />
                <h3 className={styles.modalText}>{props.text}</h3>
            </div>
        </div>
    );
};

export default LoadingModal;
