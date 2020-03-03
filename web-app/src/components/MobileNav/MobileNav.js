// ----------------------------------------------------------------------------
// File Path: src/components/MobileNav/MobileNav.js
// Description: Renders the mobile navigation component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
// ----------------------------------------------------------------------------

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

const MobileNav = props => {
    // Sets the CSS class for the current mobile nav state (shown or hidden)
    let showHideClassName = "mobileNav";
    if (props.show) {
        showHideClassName += "Show";
    } else {
        showHideClassName += "Hide";
    }

    // Returns the JSX to display
    return (
        <div className={`${styles.mobileNav} ${styles[showHideClassName]}`}>
            {props.tabs.map(tab => {
                return (
                    <MobileNavLink
                        key={tab.key}
                        name={tab.name}
                        route={tab.route}
                        icon={tab.blueIcon}
                        isCurrentTab={tab.isCurrentTab}
                        onClick={() => props.navLinkClicked(tab.key)}
                        isSignOut={false}
                    />
                );
            })}
            <MobileNavLink
                name="Sign Out"
                icon={signOutIconBlue}
                onClick={() => {
                    props.linkClicked();
                    props.signOutClicked();
                }}
                isSignOut={true}
            />
        </div>
    );
};

// Prop types for MobileNav component
MobileNav.propTypes = {
    show: PropTypes.bool.isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.exact({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            route: PropTypes.string.isRequired,
            blueIcon: PropTypes.string.isRequired,
            whiteIcon: PropTypes.string.isRequired,
            isCurrentTab: PropTypes.bool.isRequired
        })
    ).isRequired,
    signOutClicked: PropTypes.func.isRequired,
    navLinkClicked: PropTypes.func.isRequired
};

export default withRouter(MobileNav);
