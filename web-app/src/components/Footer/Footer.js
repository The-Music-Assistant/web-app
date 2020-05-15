// NPM module imports
import React from "react";
import PropTypes from "prop-types";

// Style imports
import styles from "./Footer.module.scss";

/**
 * Renders the Footer component.
 * @component
 * @category Footer
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Footer = ({ copyrightYear, versionNumber }) => {
    return (
        <footer className={styles.footer}>
            {/* Copyright */}
            <small className={styles.footerText}>
                &copy; {copyrightYear} The Music Assistant
            </small>

            {/* Version number */}
            <small className={styles.footerText}>Version {versionNumber}</small>
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
