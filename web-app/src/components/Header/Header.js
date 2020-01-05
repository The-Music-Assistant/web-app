/* ----------------------------------------------------------------------------
// File Path: src/components/Header/Header.js
// Description: Renders the header component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 10/23/2019
---------------------------------------------------------------------------- */

import React, {Component} from 'react';
import HamburgerMenu from './HamburgerMenu/HamburgerMenu';
import UserWidget from './UserWidget/UserWidget';
import Logo from './Logo/Logo';
import profilePic from '../../assets/images/profile-pic.jpeg';
import styles from './Header.module.scss';

class Header extends Component {
    state = {
        profilePic: profilePic,
        name: 'Dan Levy',
    };

    render() {
        let hamburgerMenu = null;
        if (this.props.isMobile) {
            hamburgerMenu = <HamburgerMenu handleClick={this.props.hamburgerMenuClicked} />;
        }

        return (
            <header className={styles.header}>
                {hamburgerMenu}
                <Logo isMobile={this.props.isMobile} />
                <UserWidget profilePic={this.state.profilePic} name={this.state.name} />
            </header>
        );
    }
}

export default Header;