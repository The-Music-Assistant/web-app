// ----------------------------------------------------------------------------
// File Path: src/components/SideNav/SideNav.module.scss
// Description: Renders the side navigation component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

import React from "react";
import SideNavLink from "./SideNavLink/SideNavLink";
import styles from "./SideNav.module.scss";

const SideNav = props => {
    return (
        <section id="side-nav" className={styles.sideNav}>
            {props.tabs.map(tab => {
                return (
                    <SideNavLink
                        key={tab.key}
                        name={tab.name}
                        icon={tab.desktopIcon}
                        isCurrentTab={tab.isCurrent}
                    />
                );
            })}
        </section>
    );
};

export default SideNav;
