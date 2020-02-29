// ----------------------------------------------------------------------------
// File Path: src/components/MobileNav/MobileNavLink/MobileNavLink.js
// Description: Renders the mobile navigation link component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./MobileNavLink.module.scss";

const MobileNavLink = props => {
    // Adds a line to the tab if it is the current tab
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div className={styles.mobileNavLinkCurrentTabLine}></div>;
    }

    // Returns the JSX to display
    return (
        <button className={styles.mobileNavLink}>
            <div className={styles.mobileNavLinkContainer}>
                {currentTabLine}
                <img
                    className={styles.mobileNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />
                <h3 className={styles.mobileNavLinkName}>{props.name}</h3>
            </div>
        </button>
    );
};

// Prop types for the MobileNavLink component
MobileNavLink.propTypes = {
    // isCurrentTab: PropTypes.bool.isRequired,
    // icon: PropTypes.string.isRequired,
    // name: PropTypes.string.isRequired
};

export default MobileNavLink;
