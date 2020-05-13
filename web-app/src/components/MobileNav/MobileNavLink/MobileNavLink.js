// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Style imports
import styles from "./MobileNavLink.module.scss";

/**
 * Renders the MobileNavLink component
 * @component
 * @category MobileNav
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MobileNavLink = ({ isCurrentTab, name, icon, route, onClick }) => {
    /**
     * Gets a tab line if this MobileNavLink instance is the current tab
     * @returns A tab line (JSX)
     */
    const getTabLine = () => {
        return isCurrentTab ? (
            <div className={styles.mobileNavLinkCurrentTabLine}></div>
        ) : null;
    };

    // Returns the JSX to render
    return (
        <Link className={styles.mobileNavLink} to={route} onClick={onClick}>
            {/* Tab line */}
            {getTabLine()}

            {/* Tab */}
            <div className={styles.mobileNavLinkInnerContainer}>
                {/* Tab icon */}
                <img
                    className={styles.mobileNavLinkInnerContainerIcon}
                    src={icon}
                    alt={name + " Icon"}
                />

                {/* Tab name */}
                <h3 className={styles.mobileNavLinkInnerContainerName}>
                    {name}
                </h3>
            </div>
        </Link>
    );
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
};

export default MobileNavLink;
