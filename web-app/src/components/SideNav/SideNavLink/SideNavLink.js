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
import { withRouter, Link } from "react-router-dom";

// Style imports
import styles from "./SideNavLink.module.scss";

const SideNavLink = props => {
    // The component to render
    let component;

    if (props.isSignOutLink) {
        // Sets component to the sign out version of SideNavLink
        component = (
            <button
                className={`${styles.sideNavLink} ${styles.sideNavLinkSignOut}`}
                type='button'
                onClick={props.onClick}>
                <img
                    className={styles.sideNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />
                <h3 className={`${styles.sideNavLinkName} ${styles.sideNavLinkNameWhiteText}`}>
                    {props.name}
                </h3>
            </button>
        );
    } else {
        const currentTabStyle = props.isCurrentTab ? styles.sideNavLinkCurrentTab : "";
        const textColorStyle = props.isCurrentTab
            ? styles.sideNavLinkNameBlueText
            : styles.sideNavLinkNameWhiteText;

        // Sets component to the regular version of SideNavLink
        component = (
            <Link
                className={`${styles.sideNavLink} ${currentTabStyle}`}
                to={props.route}
                onClick={props.onClick}>
                <img
                    className={styles.sideNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />
                <h3 className={`${styles.sideNavLinkName} ${textColorStyle}`}>{props.name}</h3>
            </Link>
        );
    }

    // Returns the component to display
    return component;
};

// Prop types for the SideNavLink component
SideNavLink.propTypes = {
    isCurrentTab: PropTypes.bool,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    route: PropTypes.string,
    onClick: PropTypes.func.isRequired
};

export default withRouter(SideNavLink);
