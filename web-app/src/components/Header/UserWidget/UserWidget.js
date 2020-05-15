// NPM module imports
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Style imports
import styles from "./UserWidget.module.scss";

/**
 * Renders the UserWidget component
 * @component
 * @category Header
 * @author Dan Levy <danlevy124@gmail.com>
 */
const UserWidget = () => {
    /**
     * Indicates if there was an error displaying the user's profile picture
     * {[isProfilePictureError, setIsProfilePictureError]: []}
     */
    const [isProfilePictureError, setIsProfilePictureError] = useState(false);

    /**
     * The user's name
     * @type {string}
     */
    const name = useSelector((state) => state.auth.usersName);

    /**
     * The user's profile picture url
     * @type {string}
     */
    const profilePictureUrl = useSelector(
        (state) => state.auth.usersPictureUrl
    );

    /**
     * Updates state indicating that there was a profile picture error
     */
    const profilePictureErrorHandler = () => {
        setIsProfilePictureError(true);
    };

    // Renders the UserWidget component
    return (
        <section className={styles.userWidget}>
            {/* User's profile picture */}
            {profilePictureUrl && !isProfilePictureError ? (
                <img
                    className={styles.userWidgetImg}
                    src={profilePictureUrl}
                    alt="Profile Pic"
                    onError={profilePictureErrorHandler}
                />
            ) : null}

            {/* User's name */}
            <h2 className={styles.userWidgetName}>{name}</h2>
        </section>
    );
};

export default UserWidget;
