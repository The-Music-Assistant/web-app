// ----------------------------------------------------------------------------
// File Path: src/components/SideNav/SideNavLink/SideNavLink.module.scss
// Description: Renders the side navigation link component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./SideNavLink.module.scss";

const SideNavLink = props => {
    // Adds a line to the tab if it is the current tab
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div className={styles.sideNavLinkCurrentTabLine}></div>;
    }

    // Returns the JSX to display
    return (
        <div className={styles.sideNavLink}>
            {currentTabLine}
            <img className={styles.sideNavLinkIcon} src={props.icon} alt={props.name + " Icon"} />
            <h3 className={styles.sideNavLinkName}>{props.name}</h3>
        </div>
    );
};

// Prop types for the SideNavLink component
SideNavLink.propTypes = {
    isCurrentTab: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
}

export default SideNavLink;
