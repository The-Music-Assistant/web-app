// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

// Component imports
import SideNavLink from "./SideNavLink/SideNavLink";

// Image imports
import tmaLogo from "../../assets/logos/tma-logo-blue.png";
import signOutIconWhite from "../../assets/icons/sign-out-icon-white.svg";

// Style imports
import styles from "./SideNav.module.scss";

/**
 * Renders the SideNav component
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SideNav = (props) => {
    // Returns the JSX to render
    return (
        <section id="side-nav" className={styles.sideNav}>
            {/* TMA Logo */}
            <div className={styles.sideNavLogoContainer}>
                <img
                    className={styles.sideNavLogo}
                    src={tmaLogo}
                    alt="The Music Assistant Logo"
                />
            </div>

            {/* Nav links */}
            <div className={styles.sideNavLinks}>
                {props.tabs.map((tab) => {
                    let icon;
                    if (tab.isCurrentTab) {
                        icon = tab.blueIcon;
                    } else {
                        icon = tab.whiteIcon;
                    }

                    return (
                        <SideNavLink
                            key={tab.key}
                            name={tab.name}
                            icon={icon}
                            isCurrentTab={tab.isCurrentTab}
                            route={tab.route}
                            isSignOutLink={false}
                            onClick={() => props.onNavLinkClick(tab.key)}
                        />
                    );
                })}
            </div>

            {/* Footer */}
            <div className={styles.sideNavFooter}>
                {/* Sign out link */}
                <SideNavLink
                    name="Sign Out"
                    icon={signOutIconWhite}
                    onClick={props.onSignOutClick}
                    isSignOutLink={true}
                />

                {/* Copyright and version number */}
                <small className={styles.sideNavFooterText}>
                    &copy; {props.copyrightYear}
                    <br />
                    The Music Assistant
                    <br />
                    Version {props.versionNumber}
                </small>
            </div>
        </section>
    );
};

// Prop types for the SideNav component
SideNav.propTypes = {
    /**
     * Side nav tabs
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
     * The copyright year for the app
     */
    copyrightYear: PropTypes.string.isRequired,

    /**
     * The current app version number
     */
    versionNumber: PropTypes.string.isRequired,

    /**
     * Sign out click handler
     */
    onSignOutClick: PropTypes.func.isRequired,

    /**
     * Nav link click handler
     */
    onNavLinkClick: PropTypes.func.isRequired,
};

export default withRouter(SideNav);
