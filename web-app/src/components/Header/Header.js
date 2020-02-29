/* ----------------------------------------------------------------------------
// File Path: src/components/Header/Header.js
// Description: Renders the header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
---------------------------------------------------------------------------- */

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";

// Component imports
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import UserWidget from "./UserWidget/UserWidget";
import Logo from "./Logo/Logo";

// Style imports
import styles from "./Header.module.scss";

class Header extends Component {
    // Component state
    state = {
        profilePic: null,
        name: "Dan Levy"
    };

    // Returns JSX to render
    render() {
        // let hamburgerMenu = null;
        // if (this.props.isMobile) {
        //     hamburgerMenu = <HamburgerMenu handleClick={this.props.hamburgerMenuClicked} />;
        // }

        return (
            <header className={styles.header}>
                {/* {hamburgerMenu} */}
                <h1 className={styles.headerHeading}>Good Afternoon</h1>
                <UserWidget profilePic={this.state.profilePic} name={this.state.name} />
            </header>
        );
    }
}

// Header prop types
Header.propTypes = {
    isMobile: PropTypes.bool.isRequired,
    hamburgerMenuClicked: PropTypes.func
};

export default Header;
