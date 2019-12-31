import React from "react";
import "./HamburgerMenu.scss";

const HamburgerMenu = props => {
    return (
        <button id='hamburger-menu' onClick={props.handleClick}>
            <div className='hamburger-menu-bar'></div>
            <div className='hamburger-menu-bar'></div>
            <div className='hamburger-menu-bar'></div>
        </button>
    );
};

export default HamburgerMenu;
