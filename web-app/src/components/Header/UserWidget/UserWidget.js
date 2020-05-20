// NPM module imports
import React, { useState, useContext } from "react";

// Context Imports
import GlobalContext from "../../../App/GlobalContext";

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
     * The user's full name and profile picture URL
     * @type {object}
     * @property {string} userFullName - The user's full name
     * @property {string} userPictureUrl - The user's profile picture URL
     */
    const { userFullName, userPictureUrl } = useContext(GlobalContext);

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
            {userPictureUrl && !isProfilePictureError ? (
                <img
                    className={styles.userWidgetImg}
                    src={userPictureUrl}
                    alt="Profile Pic"
                    onError={profilePictureErrorHandler}
                />
            ) : null}

            {/* User's name */}
            <h2 className={styles.userWidgetName}>{userFullName}</h2>
        </section>
    );
};

export default UserWidget;
