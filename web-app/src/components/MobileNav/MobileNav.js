// ----------------------------------------------------------------------------
// File Path: src/components/MobileNav/MobileNav.module.scss
// Description: Renders the mobile navigation component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

import React from "react";
import styles from "./MobileNav.module.scss";
import MobileNavLink from "./MobileNavLink/MobileNavLink";

const MobileNav = props => {
    let showHideId = "mobileNav";
    if (props.show) {
        showHideId += "Show";
    } else {
        showHideId += "Hide";
    }

    return (
        <div className={[styles.mobileNav, styles[showHideId]].join(" ")}>
            {props.tabs.map(tab => {
                return (
                    <MobileNavLink
                        key={tab.key}
                        name={tab.name}
                        icon={tab.mobileIcon}
                        isCurrentTab={tab.isCurrent}
                    />
                );
            })}
        </div>
    );
};

export default MobileNav;
