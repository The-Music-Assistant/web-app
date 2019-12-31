import React, {Component} from 'react';
import './Header.scss';
import HamburgerMenu from './HamburgerMenu/HamburgerMenu';
import UserWidget from './UserWidget/UserWidget';
import Logo from './Logo/Logo';
import profilePic from '../../assets/images/profile-pic.jpeg';

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
            <header>
                {hamburgerMenu}
                <Logo isMobile={this.props.isMobile} />
                <UserWidget profilePic={this.state.profilePic} name={this.state.name} />
            </header>
        );
    }
}

export default Header;