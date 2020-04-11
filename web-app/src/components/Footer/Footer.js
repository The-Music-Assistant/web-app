// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./Footer.module.scss";

/**
 * Renders the Footer component.
 * @component
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Footer = (props) => {
    return (
        <footer className={styles.footer}>
            <small className={styles.footerText}>
                &copy; {props.copyrightYear} The Music Assistant
            </small>
            <small className={styles.footerText}>Version {props.versionNumber}</small>
        </footer>
    );
};

// Prop types for the Footer component
Footer.propTypes = {
    /**
     * The copyright year for the app
     */
    copyrightYear: PropTypes.string.isRequired,

    /**
     * The current app version number
     */
    versionNumber: PropTypes.string.isRequired,
};

export default Footer;
