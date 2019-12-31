import React from "react";
import "./Logo.scss";
import musicAssistantLogo from "../../../assets/logos/music-assistant-logo.png";

const Logo = props => {
    let name = null;
    if (!props.isMobile) {
        name = <h1 id='logo-name'>The Music Assistant</h1>
    }

    return (
        <div id='logo'>
            <img id='logo-img' src={musicAssistantLogo} alt='Logo' />
            {name}
        </div>
    );
};

export default Logo;