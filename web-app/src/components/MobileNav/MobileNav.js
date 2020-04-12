// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// Component imports
import MobileNavLink from "./MobileNavLink/MobileNavLink";

// Image imports
import signOutIconBlue from "../../assets/icons/sign-out-icon-blue.svg";

// Style imports
import styles from "./MobileNav.module.scss";

/**
 * Renders the MobileNav component
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MobileNav = (props) => {
    /**
     * Gets the show/hide class name based on the props show property
     * @returns {string} The show/hide class name
     */
    const getShowOrHideClassName = () => {
        return props.show ? styles.mobileNavShow : styles.mobileNavHide;
    };

    /**
     * Gets MobileNavLink components
     * @returns MobileNavLink components (JSX)
     */
    const getMobileNavLinks = () => {
        return props.tabs.map((tab) => {
            return (
                <MobileNavLink
                    key={tab.key}
                    name={tab.name}
                    route={tab.route}
                    icon={tab.blueIcon}
                    isCurrentTab={tab.isCurrentTab}
                    onClick={() => props.navLinkClicked(tab.key)}
                    isSignOutLink={false}
                />
            );
        });
    };

    // Returns the JSX to render
    return (
        <div className={`${styles.mobileNav} ${getShowOrHideClassName()}`}>
            {/* Mobile nav links */}
            {getMobileNavLinks()}
            <MobileNavLink
                name="Sign Out"
                icon={signOutIconBlue}
                onClick={props.onSignOutClick}
                isSignOutLink={true}
            />
        </div>
    );
};

// Prop types for MobileNav component
MobileNav.propTypes = {
    /**
     * Indicates if the mobile nav should be displayed
     */
    show: PropTypes.bool.isRequired,

    /**
     * Mobile nav links
     */
    tabs: PropTypes.arrayOf(
        PropTypes.exact({
            key: PropTypes.string,
            name: PropTypes.string,
            route: PropTypes.string,
            blueIcon: PropTypes.string,
            whiteIcon: PropTypes.string,
            isCurrentTab: PropTypes.bool,
        })
    ).isRequired,

    /**
     * Sign out click handler
     */
    onSignOutClick: PropTypes.func.isRequired,

    /**
     * Nav link click handler
     */
    onNavLinkClick: PropTypes.func.isRequired,
};

export default withRouter(MobileNav);
