// ----------------------------------------------------------------------------
// File Path: src/components/SideNav/SideNavLink/SideNavLink.module.scss
// Description: Renders the side navigation link component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./SideNavLink.module.scss";

const SideNavLink = props => {
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div className={styles.sideNavLinkCurrentTabLine}></div>;
    }

    return (
        <div className={styles.sideNavLink}>
            {currentTabLine}
            <img className={styles.sideNavLinkIcon} src={props.icon} alt={props.name + " Icon"} />
            <h3 className={styles.sideNavLinkName}>{props.name}</h3>
        </div>
    );
};

export default SideNavLink;
