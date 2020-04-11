// ----------------------------------------------------------------------------
// File Path: src/components/SideNav/SideNav.module.scss
// Description: Renders the side navigation component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

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

const SideNav = (props) => {
    // Returns the JSX to render
    return (
        <section id='side-nav' className={styles.sideNav}>
            <div className={styles.sideNavLogoContainer}>
                <img className={styles.sideNavLogo} src={tmaLogo} alt='The Music Assistant Logo' />
            </div>
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
                            onClick={() => props.navLinkClicked(tab.key)}
                        />
                    );
                })}
            </div>
            <div className={styles.sideNavFooter}>
                <SideNavLink
                    name='Sign Out'
                    icon={signOutIconWhite}
                    onClick={props.signOutClicked}
                    isSignOutLink={true}
                />
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
    tabs: PropTypes.arrayOf(
        PropTypes.exact({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            route: PropTypes.string.isRequired,
            blueIcon: PropTypes.string.isRequired,
            whiteIcon: PropTypes.string.isRequired,
            isCurrentTab: PropTypes.bool.isRequired,
        })
    ).isRequired,
    signOutClicked: PropTypes.func.isRequired,
    navLinkClicked: PropTypes.func.isRequired,
    /**
     * The copyright year for the app
     */
    copyrightYear: PropTypes.string.isRequired,

    /**
     * The current app version number
     */
    versionNumber: PropTypes.string.isRequired,
};

export default withRouter(SideNav);
