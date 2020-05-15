// NPM module imports
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// File imports
import * as colorOptions from "./memberCardColorOptions";
import firebase from "../../../vendors/Firebase/firebase";

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
const MemberCard = ({ personId, name, hasPicture, roles, color }) => {
    /**
     * Indicates if there was an error loading the member's profile picture
     * {[isProfilePicLoadError, setIsProfilePicLoadError]: [boolean, function]}
     */
    const [isProfilePicLoadError, setIsProfilePicLoadError] = useState(false);

    /**
     * The member's profile picture url
     * {[profilePictureUrl, setProfilePictureUrl]: [string, function]}
     */
    const [profilePictureUrl, setProfilePictureUrl] = useState("");

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    const isMounted = useRef(false);

    /**
     * Sets isMounted to true
     * @returns {function} A cleanup function that sets isMounted to false
     */
    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * Gets the user's profile picture URL.
     * Sets the URL in state.
     */
    useEffect(() => {
        if (hasPicture) {
            firebase
                .storage()
                .ref()
                .child(`users/${personId}/profile_picture_200x200`)
                .getDownloadURL()
                .then((url) => {
                    if (isMounted.current) {
                        setProfilePictureUrl(url);
                    }
                });
        }
    }, [hasPicture, personId]);

    /**
     * Updates state to indicate that there was an error loading the member's profile picture
     */
    const profilePicLoadErrorHandler = () => {
        if (isMounted.current) {
            setIsProfilePicLoadError(true);
        }
    };

    /**
     * Gets the correct image component
     * @returns {object} An image component (JSX)
     */
    const getImageComponent = () => {
        if (!profilePictureUrl || isProfilePicLoadError) {
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
                    src={profilePictureUrl}
                    alt="User Avatar"
                    onError={profilePicLoadErrorHandler}
                />
            );
        }
    };

    // Renders the MemberCard component
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
     * The id of the person who is associated with this member
     */
    personId: PropTypes.string.isRequired,

    /**
     * The member's name
     */
    name: PropTypes.string.isRequired,

    /**
     * Indicates if the member (aka person) has a profile picture
     */
    hasPicture: PropTypes.bool.isRequired,

    /**
     * The member's role(s) (e.g. alto)
     */
    roles: PropTypes.string.isRequired,

    /**
     * The background color of the component.
     * See [options]{@link module:memberCardColorOptions}.
     */
    color: PropTypes.oneOf(Object.values(colorOptions)).isRequired,
};

export default MemberCard;
