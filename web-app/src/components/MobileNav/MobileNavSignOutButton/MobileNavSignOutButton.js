// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./MobileNavSignOutButton.module.scss";

/**
 * Renders the MobileNavSignOutButton component
 * @component
 * @category MobileNav
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MobileNavSignOutButton = ({ name, icon, onClick }) => {
    // Returns the JSX to render
    return (
        <button className={styles.mobileNavSignOutButton} onClick={onClick}>
            {/* Inner div is used because buttons can't be a grid or flexbox container */}
            <div className={styles.mobileNavSignOutButtonInnerContainer}>
                {/* Tab icon */}
                <img
                    className={styles.mobileNavSignOutButtonInnerContainerIcon}
                    src={icon}
                    alt={name + " Icon"}
                />

                {/* Tab name */}
                <h3 className={styles.mobileNavSignOutButtonInnerContainerName}>
                    {name}
                </h3>
            </div>
        </button>
    );
};

// Prop types for the MobileNavLink component
MobileNavSignOutButton.propTypes = {
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

export default MobileNavSignOutButton;
