// NPM module imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./memberCardColorOptions";

// Style imports
import styles from "./MemberCard.module.scss";
import colorStyles from "./MemberCardColors.module.scss";

/**
 * Renders the MemberCard component.
 * Contains a member's profile.
 * @component
 * @category ChoirMembers
 * @author Dan Levy <danlevy124@gmail.com>
 */
const MemberCard = ({ name, roles, profilePictureSrc, color }) => {
    /**
     * Indicates if there was an error loading the member's profile picture
     * {[isProfilePicLoadError, setIsProfilePicLoadError]: [boolean, function]}
     */
    const [isProfilePicLoadError, setIsProfilePicLoadError] = useState(false);

    /**
     * Updates state to indicate that there was an error loading the member's profile picture
     */
    const profilePicLoadErrorHandler = () => {
        setIsProfilePicLoadError(true);
    };

    /**
     * Gets the correct image component
     * @returns {object} An image component (JSX)
     */
    const getImageComponent = () => {
        if (!profilePictureSrc || isProfilePicLoadError) {
            // Returns a placeholder image with the first letter of the user's name
            return (
                <div className={styles.memberCardImagePlaceholder}>
                    {name.length > 0 ? (
                        <h1
                            className={`${
                                styles.memberCardImagePlaceholderLetter
                            } ${colorStyles[color + "ImagePlaceholderLetter"]}`}
                        >
                            {name.substring(0, 1)}
                        </h1>
                    ) : null}
                </div>
            );
        } else {
            // Returns the user's profile picture
            return (
                <img
                    className={styles.memberCardImage}
                    src={profilePictureSrc}
                    alt="User Avatar"
                    onError={profilePicLoadErrorHandler}
                />
            );
        }
    };

    /**
     * Renders the MemberCard component
     */
    return (
        <div className={`${styles.memberCard} ${colorStyles[color]}`}>
            {/* User's profile picture */}
            {getImageComponent()}

            {/* User's name */}
            <h1 className={styles.memberCardName}>{name}</h1>

            {/* User's choir role(s) */}
            <h2 className={styles.memberCardRoles}>{roles}</h2>
        </div>
    );
};

// Prop types for MemberCard component
MemberCard.propTypes = {
    /**
     * The member's name
     */
    name: PropTypes.string.isRequired,

    /**
     * The member's role(s) (e.g. alto)
     */
    roles: PropTypes.string.isRequired,

    /**
     * The member's profile picture file path
     */
    profilePictureSrc: PropTypes.string,

    /**
     * The background color of the component.
     * See [options]{@link module:memberCardColorOptions}.
     */
    color: PropTypes.oneOf(Object.values(colorOptions)).isRequired,
};

export default MemberCard;
