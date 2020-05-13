// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Component imports
import SideNavLink from "./SideNavLink/SideNavLink";
import SideNavSignOutButton from "./SideNavSignOutButton/SideNavSignOutButton";

// Image imports
import tmaLogo from "../../assets/logos/tma-logo-blue.png";
import signOutIconWhite from "../../assets/icons/sign-out-icon-white.svg";

// Style imports
import styles from "./SideNav.module.scss";

/**
 * Renders the SideNav component
 * @component
 * @category SideNav
 * @author Dan Levy <danlevy124@gmail.com>
 */
const SideNav = ({
    tabs,
    copyrightYear,
    versionNumber,
    onSignOutClick,
    onNavLinkClick,
}) => {
    // Returns the JSX to render
    return (
        <section id="side-nav" className={styles.sideNav}>
            {/* TMA Logo */}
            <header className={styles.sideNavLogo}>
                <img
                    className={styles.sideNavLogoImage}
                    src={tmaLogo}
                    alt="The Music Assistant Logo"
                />
            </header>

            {/* Nav links */}
            <nav className={styles.sideNavLinks}>
                {tabs.map((tab) => {
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
                            onClick={() => onNavLinkClick(tab.key)}
                        />
                    );
                })}
            </nav>

            {/* Footer */}
            <footer className={styles.sideNavFooter}>
                {/* Sign out link */}
                <SideNavSignOutButton
                    name="Sign Out"
                    icon={signOutIconWhite}
                    onClick={onSignOutClick}
                />

                {/* Copyright and version number */}
                <small className={styles.sideNavFooterText}>
                    &copy; {copyrightYear}
                    <br />
                    The Music Assistant
                    <br />
                    Version {versionNumber}
                </small>
            </footer>
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

export default SideNav;
