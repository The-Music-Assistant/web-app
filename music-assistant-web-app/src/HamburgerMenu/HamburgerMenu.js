import React from 'react';
import './HamburgerMenu.scss';

const HamburgerMenu = props => {

    return (
        <div id='hamburger-menu' onClick={props.handleClick}>
            <div className='hamburger-menu-bar'></div>
            <div className='hamburger-menu-bar'></div>
            <div className='hamburger-menu-bar'></div>
        </div>
    );
}

export default HamburgerMenu;