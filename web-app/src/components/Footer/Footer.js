import React from "react";
import styles from "./Footer.module.scss";
import floridaTechLogo from "../../assets/logos/florida-tech-logo.png";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <img className={styles.footerLogo} src={floridaTechLogo} alt="Florida Tech Logo" />
            <small className={styles.footerCopyright}>&copy; 2019 The Music Assistant</small>
        </footer>
    );
}

export default Footer;