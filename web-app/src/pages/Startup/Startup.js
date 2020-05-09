// NPM module imports
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MetroSpinner } from "react-spinners-kit";

// File imports
import { startupDone } from "../../store/actions";

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
    /**
     * Indicates if there is an authenticated user
     * @type {boolean}
     */
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    /**
     * react-redux dispatch function
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Tells Redux when app startup is done
     */
    useEffect(() => {
        if (isAuthenticated !== null) {
            // Startup is considered to be done when isAuthenticated is true or false
            dispatch(startupDone());
        }
    }, [dispatch, isAuthenticated]);

    /**
     * Renders the Startup component
     */
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
