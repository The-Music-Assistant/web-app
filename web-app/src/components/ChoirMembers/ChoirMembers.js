// NPM module imports
import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import shortid from "shortid";

// Component imports
import MemberCard from "./MemberCard/MemberCard";
import PageHeader from "../PageHeader/PageHeader";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// File imports
import { getChoirMembers } from "../../vendors/AWS/tmaApi";
import firebase from "../../vendors/Firebase/firebase";
import * as memberColorOptions from "./MemberCard/memberCardColorOptions";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import { choirMembersError } from "../../vendors/Firebase/logs";

// Style imports
import styles from "./ChoirMembers.module.scss";

/**
 * Renders the ChoirMembers component.
 * Shows all choir member profiles.
 * @component
 * @category ChoirMembers
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ChoirMembers = ({ showAlert }) => {
    /**
     * Indicates if the component is in a loading state
     * {[isLoading, setIsLoading]: [boolean, function]}
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * An array of choir members
     * {[members, setMembers]: [array, function]}
     */
    const [members, setMembers] = useState([]);

    /**
     * The id of the selected choir
     * @type {string}
     */
    const choirId = useSelector((state) => state.choirs.selectedChoirId);

    /**
     * The name of the selected choir
     * @type {string}
     */
    const choirName = useSelector((state) => state.choirs.selectedChoirName);

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     * @type {boolean}
     */
    const isMounted = useRef(false);

    /**
     * Gets each member's profile picture url.
     * Updates state with the url.
     */
    const getMembersProfilePictures = useCallback((currentMembers) => {
        for (let i = 0; i < currentMembers.length; i++) {
            // Get the member (deep copy)
            const member = { ...currentMembers[i] };

            if (member.has_picture) {
                // Gets the member's picture url from Firebase storage
                firebase
                    .storage()
                    .ref()
                    .child(`users/${member.person_id}/profile_picture_200x200`)
                    .getDownloadURL()
                    .then((url) => {
                        // Updates state with the url
                        member.picture_url = url;
                        const membersCopy = [...currentMembers];
                        membersCopy[i] = member;
                        if (isMounted.current) {
                            setMembers(membersCopy);
                        }
                    });
            }
        }
    }, []);

    /**
     * Gets the choir members from the server.
     * Updates state with the members.
     */
    const getMembers = useCallback(() => {
        getChoirMembers({ choirId: choirId })
            .then((response) => {
                // Updates state
                if (isMounted.current) {
                    setIsLoading(false);
                    setMembers(response.data);
                }

                // Gets each member's profile picture (this is async and will update the correct card when the picture comes in)
                getMembersProfilePictures(response.data);
            })
            .catch((error) => {
                // Logs an error
                choirMembersError(
                    error.response.status,
                    error.response.data,
                    "[ChoirMembers/getMembers]"
                );

                // Shows an error alert
                showAlert(alertBarTypes.ERROR, "Error", error.response.data);

                // Updates state
                if (isMounted.current) {
                    setIsLoading(false);
                }
            });
    }, [choirId, getMembersProfilePictures, showAlert]);

    /**
     * Sets _isMounted to true
     * Gets the choir members
     * @returns A cleanup function that sets _isMounted to false
     */
    useEffect(() => {
        isMounted.current = true;

        // Gets the choir members
        getMembers();

        return () => {
            isMounted.current = false;
        };
    }, [getMembers]);

    /**
     * Gets an array of admin member cards and an array of student member cards
     * @returns {object} An object containing an array of admin MemberCard components and an array of student MemberCard components
     */
    const getMemberCards = () => {
        const admins = [];
        const students = [];

        // Creates a member card for each member of the choir
        for (let i = 0; i < members.length; i++) {
            // Gets the current member
            const member = members[i];

            if (member.member_type === "admin") {
                // Creates an admin member card
                admins.push(createMemberCard(member, memberColorOptions.GREEN));
            } else {
                // Creates a student member card
                students.push(
                    createMemberCard(member, memberColorOptions.ORANGE)
                );
            }
        }

        return { admins, students };
    };

    /**
     * Creates a member card component
     * @param {object} member - The member data used to create the member card
     * @param {string} color - The color to use for the card
     * @returns {object} A MemberCard component
     */
    const createMemberCard = (member, color) => {
        return (
            <MemberCard
                key={shortid.generate()}
                name={`${member.first_name} ${member.last_name}`}
                roles={member.member_role}
                profilePictureSrc={member.picture_url}
                color={color}
            />
        );
    };

    /**
     * Gets the main component to display
     * @returns JSX
     */
    const getComponent = () => {
        const { admins, students } = getMemberCards();

        if (isLoading) {
            // Display a loading spinner
            return <LoadingContainer message="Loading members..." />;
        } else {
            // Display the choir cards
            return (
                <section>
                    {/* Admin heading */}
                    <h1 className={styles.choirMembersMemberGroupHeading}>
                        Administrators
                    </h1>

                    {/* Admin list */}
                    <section className={styles.choirMembersCards}>
                        {admins}
                    </section>

                    {/* Student heading */}
                    <h1 className={styles.choirMembersMemberGroupHeading}>
                        Students
                    </h1>

                    {/* Student list */}
                    <section className={styles.choirMembersCards}>
                        {students}
                    </section>
                </section>
            );
        }
    };

    // Renders the ChoirMembers component
    return (
        <div className={styles.choirMembers}>
            <PageHeader
                heading={`${choirName} Members`}
                shouldDisplayBackButton={true}
                backButtonTitle={"Choir Selection"}
            />

            {getComponent()}
        </div>
    );
};

// Prop types for the ChoirMembers component
ChoirMembers.propTypes = {
    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,
};

export default ChoirMembers;
