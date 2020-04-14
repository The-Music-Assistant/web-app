// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Style imports
import styles from "./SideNavLink.module.scss";

/**
 * Renders the SideNavLink component
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
// TODO: This component should be split into a two components: (1) side nav link and (2) side nav sign out link
const SideNavLink = (props) => {
    // The component to render
    let component;

    if (props.isSignOutLink) {
        // Sets component to the sign out version of SideNavLink
        component = (
            <button
                className={`${styles.sideNavLink} ${styles.sideNavLinkSignOut}`}
                type="button"
                onClick={props.onClick}
            >
                {/* Tab icon */}
                <img
                    className={styles.sideNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />

                {/* Tab name */}
                <h3
                    className={`${styles.sideNavLinkName} ${styles.sideNavLinkNameWhiteText}`}
                >
                    {props.name}
                </h3>
            </button>
        );
    } else {
        const currentTabStyle = props.isCurrentTab
            ? styles.sideNavLinkCurrentTab
            : "";

        const textColorStyle = props.isCurrentTab
            ? styles.sideNavLinkNameBlueText
            : styles.sideNavLinkNameWhiteText;

        // Sets component to the regular version of SideNavLink
        component = (
            <Link
                className={`${styles.sideNavLink} ${currentTabStyle}`}
                to={props.route}
                onClick={props.onClick}
            >
                {/* Tab icon */}
                <img
                    className={styles.sideNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />

                {/* Tab name */}
                <h3 className={`${styles.sideNavLinkName} ${textColorStyle}`}>
                    {props.name}
                </h3>
            </Link>
        );
    }

    // Returns the JSX to render
    return component;
};

// Prop types for the SideNavLink component
SideNavLink.propTypes = {
    /**
     * Indicates if the tab is the currently selected tab
     */
    isCurrentTab: PropTypes.bool,

    /**
     * The tab name
     */
    name: PropTypes.string.isRequired,

    /**
     * The tab icon
     */
    icon: PropTypes.string.isRequired,

    /**
     * Where to route if the tab is clicked on
     */
    route: PropTypes.string,

    /**
     * Click handler
     */
    onClick: PropTypes.func.isRequired,

    /**
     * Indicates if the link is a sign out link
     */
    isSignOutLink: PropTypes.bool.isRequired,
};

export default SideNavLink;
