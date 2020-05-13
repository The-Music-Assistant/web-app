// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./SideNavSignOutButton.module.scss";

/**
 * Renders the SideNavSignOutButton component
 * @component
 * @category SideNav
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SideNavSignOutButton = ({ name, icon, onClick }) => {
    return (
        <button
            className={styles.sideNavSignOutButton}
            type="button"
            onClick={onClick}
        >
            {/* Tab icon */}
            <img
                className={styles.sideNavSignOutButtonIcon}
                src={icon}
                alt={name + " Icon"}
            />

            {/* Tab name */}
            <h3 className={styles.sideNavSignOutButtonName}>{name}</h3>
        </button>
    );
};

// Prop types for the SideNavLink component
SideNavSignOutButton.propTypes = {
    /**
     * The tab name
     */
    name: PropTypes.string.isRequired,

    /**
     * The tab icon
     */
    icon: PropTypes.string.isRequired,

    /**
     * Click handler
     */
    onClick: PropTypes.func.isRequired,
};

export default SideNavSignOutButton;
