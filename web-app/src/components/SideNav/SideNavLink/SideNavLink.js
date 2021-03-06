// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Style imports
import styles from "./SideNavLink.module.scss";

/**
 * Renders the SideNavLink component
 * @component
 * @category SideNav
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SideNavLink = ({ isCurrentTab, name, icon, route, onClick }) => {
    const currentTabStyle = isCurrentTab ? styles.sideNavLinkCurrentTab : "";

    const textColorStyle = isCurrentTab
        ? styles.sideNavLinkNameBlueText
        : styles.sideNavLinkNameWhiteText;

    return (
        <Link
            className={`${styles.sideNavLink} ${currentTabStyle}`}
            to={route}
            onClick={onClick}
        >
            {/* Tab icon */}
            <img
                className={styles.sideNavLinkIcon}
                src={icon}
                alt={name + " Icon"}
            />

            {/* Tab name */}
            <h3 className={`${styles.sideNavLinkName} ${textColorStyle}`}>
                {name}
            </h3>
        </Link>
    );
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
};

export default SideNavLink;
