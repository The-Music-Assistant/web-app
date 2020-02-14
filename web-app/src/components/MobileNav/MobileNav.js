// ----------------------------------------------------------------------------
// File Path: src/components/MobileNav/MobileNav.js
// Description: Renders the mobile navigation component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import MobileNavLink from "./MobileNavLink/MobileNavLink";

// Style imports
import styles from "./MobileNav.module.scss";

const MobileNav = props => {
    // Sets the CSS class for the current mobile nav state (shown or hidden)
    let showHideClassName = "mobileNav";
    if (props.show) {
        showHideClassName += "Show";
    } else {
        showHideClassName += "Hide";
    }

    // Returns the JSX to display
    return (
        <div className={[styles.mobileNav, styles[showHideClassName]].join(" ")}>
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

// Prop types for MobileNav component
MobileNav.propTypes = {
    show: PropTypes.bool.isRequired,
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

export default MobileNav;
