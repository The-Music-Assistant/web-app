// NPM module imports
import React from "react";
import { MetroSpinner } from "react-spinners-kit";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";

// Style imports
import styles from "./Startup.module.scss";

/**
 * Renders the Startup component.
 * This component displays when the app is starting up (i.e. getting auth data).
 * @component
 * @category Startup
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Startup = () => {
    // Renders the Startup component
    return (
        <main className={styles.startup}>
            {/* Main content */}
            <section>
                {/* TMA Logo */}
                <img
                    className={styles.startupLogo}
                    src={logo}
                    alt="The Music Assistant Logo"
                />

                {/* Heading */}
                <h1 className={styles.startupHeading}>The Music Assistant</h1>

                {/* Subheading */}
                <h2 className={styles.startupSubheading}>Just a moment...</h2>

                {/* Spinner */}
                <div className={styles.startupSpinner}>
                    <MetroSpinner size={75} color="#F8F8F8" loading={true} />
                </div>
            </section>
        </main>
    );
};

export default Startup;
