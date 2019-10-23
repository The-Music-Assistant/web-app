import React, {Component} from 'react';
import './Header.scss';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import Logo from '../Logo/Logo';
import UserWidget from '../UserWidget/UserWidget';
import profilePic from '../img/profile-pic.jpeg';

class Header extends Component {
    state = {
        isMobile: false,
        profilePic: profilePic,
        name: 'Dan Levy'
    };

    handleWindowResize = () => {
        this.setState({isMobile: window.innerWidth < 480});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    render() {
        let hamburgerMenu = null;
        // if (this.state.isMobile) {
        //     hamburgerMenu = <HamburgerMenu />;
        // }
        hamburgerMenu = <HamburgerMenu />;

        return (
            <header>
                {hamburgerMenu}
                <Logo isMobile={this.state.isMobile} />
                <UserWidget profilePic={this.state.profilePic} name={this.state.name} />
            </header>
        );
    }
}

export default Header;