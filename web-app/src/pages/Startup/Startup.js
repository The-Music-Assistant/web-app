// ----------------------------------------------------------------------------
// File Path: src/pages/Startup/Startup.js
// Description: Renders the startup page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/4/2020
// ----------------------------------------------------------------------------

import React from "react";
import { MetroSpinner } from "react-spinners-kit";
import styles from "./Startup.module.scss";

const Startup = () => {
    return (
        <div className={styles.startupContainer}>
            <MetroSpinner size={100} color='#FFFFFF' loading={true} />
        </div>
    );
};

export default Startup;
