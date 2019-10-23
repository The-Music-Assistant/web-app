import React from "react";
import "./Footer.scss";
import floridaTechLogo from "../assets/logos/florida-tech-logo.png"

const Footer = () => {
    return (
        <footer>
            <img id="footer-logo" src={floridaTechLogo} alt="Florida Tech Logo" />
            <small id="footer-copyright">&copy; 2019 The Music Assistant</small>
        </footer>
    );
}

export default Footer;