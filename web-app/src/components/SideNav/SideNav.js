// ----------------------------------------------------------------------------
// File Path: src/components/SideNav/SideNav.module.scss
// Description: Renders the side navigation component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import SideNavLink from "./SideNavLink/SideNavLink";

// Style imports
import styles from "./SideNav.module.scss";

const SideNav = props => {
    // Returns the JSX to render
    return (
        <section id='side-nav' className={styles.sideNav}>
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

// Prop types for the SideNav component
SideNav.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.exact({
            key: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            mobileIcon: PropTypes.string.isRequired,
            desktopIcon: PropTypes.string.isRequired,
            isCurrent: PropTypes.bool.isRequired
        })
    ).isRequired
};

export default SideNav;
