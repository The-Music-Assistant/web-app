// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { MetroSpinner } from "react-spinners-kit";

// Style imports
import styles from "./LoadingContainer.module.scss";

/**
 * Renders the LoadingContainer component.
 * This component takes up the entire width and height of its parent component.
 * This component is typically used when loading a page of data (e.g. a list of users).
 * @component
 * @category Spinners
 * @author Dan Levy <danlevy124@gmail.com>
 */
const LoadingContainer = (props) => {
    // Returns the JSX to render
    return (
        <section className={styles.loadingContainer}>
            {/* Spinner */}
            <MetroSpinner size={75} color="#5F9CD1" loading={true} />

            {/* Message */}
            <h1 className={styles.loadingContainerMessage}>{props.message}</h1>
        </section>
    );
};

// Prop types for the LoadingContainer component
LoadingContainer.propTypes = {
    /**
     * The message to display
     */
    message: PropTypes.string.isRequired,
};

export default LoadingContainer;
