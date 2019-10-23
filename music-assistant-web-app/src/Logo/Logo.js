import React from "react";
import "./Logo.scss";
import logo from "../img/logo.png";

const Logo = props => {
    let name = null;
    if (!props.isMobile) {
        name = <h1 id='logo-name'>The Music Assistant</h1>
    }

    return (
        <div id='logo'>
            <img id='logo-img' src={logo} alt='Logo' />
            {name}
        </div>
    );
};

export default Logo;