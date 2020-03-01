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
import { Link } from "react-router-dom";

// Style imports
import styles from "./MobileNavLink.module.scss";

const MobileNavLink = props => {
    // Adds a line to the tab if it is the current tab
    let currentTabLine = null;
    if (props.isCurrentTab) {
        currentTabLine = <div className={styles.mobileNavLinkCurrentTabLine}></div>;
    }

    // The component to render
    let component = (
        <div className={styles.mobileNavLink} onClick={props.onClick}>
            <div className={styles.mobileNavLinkContainer}>
                {currentTabLine}
                <img
                    className={styles.mobileNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />
                <h3 className={styles.mobileNavLinkName}>{props.name}</h3>
            </div>
        </div>
    );

    if (!props.isSignOut) {
        // Wrap component in link
        component = <Link to={props.route}>{component}</Link>;
    }

    // Returns the component to display
    return component;
};

// Prop types for the MobileNavLink component
MobileNavLink.propTypes = {
    isCurrentTab: PropTypes.bool,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    route: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isSignOut: PropTypes.bool.isRequired
};

export default MobileNavLink;
