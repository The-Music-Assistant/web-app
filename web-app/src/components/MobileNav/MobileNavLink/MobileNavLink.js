// ----------------------------------------------------------------------------
// File Path: src/components/MobileNav/MobileNavLink/MobileNavLink.js
// Description: Renders the mobile navigation link component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./MobileNavLink.module.scss";

const MobileNavLink = props => {
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div className={styles.mobileNavLinkCurrentTabLine}></div>;
    }
    
    return (
        <button className={styles.mobileNavLink}>
            <div className={styles.mobileNavLinkContainer}>
                {currentTabLine}
                <img className={styles.mobileNavLinkIcon} src={props.icon} alt={props.name + " Icon"} />
                <h3 className={styles.mobileNavLinkName}>{props.name}</h3>
            </div>
        </button>
    );
};

export default MobileNavLink;
