// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Style imports
import styles from "./MobileNavLink.module.scss";

/**
 * Renders the MobileNavLink component
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MobileNavLink = (props) => {
    /**
     * Gets a tab line if this MobileNavLink instance is the current tab
     * @returns A tab line (JSX)
     */
    const getTabLine = () => {
        return props.isCurrentTab ? (
            <div className={styles.mobileNavLinkCurrentTabLine}></div>
        ) : null;
    };

    // The component to render
    let component = (
        <div className={styles.mobileNavLink} onClick={props.onClick}>
            <div className={styles.mobileNavLinkContainer}>
                {/* Tab line */}
                {getTabLine()}

                {/* Tab icon */}
                <img
                    className={styles.mobileNavLinkIcon}
                    src={props.icon}
                    alt={props.name + " Icon"}
                />

                {/* Tab name */}
                <h3 className={styles.mobileNavLinkName}>{props.name}</h3>
            </div>
        </div>
    );

    if (!props.isSignOutLink) {
        // Wrap the main component in a Link component
        component = (
            <Link className={styles.mobileNavLinkAnchorTag} to={props.route}>
                {component}
            </Link>
        );
    }

    // Returns the JSX to render
    return component;
};

// Prop types for the MobileNavLink component
MobileNavLink.propTypes = {
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

export default MobileNavLink;
