// NPM module imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class ChoirMembers extends Component {
    /**
     * ChoirMembers component state
     * @property {boolean} isLoading - Indicates if the component is in a loading state
     * @property {array} members - A list of choir members
     */
    state = {
        isLoading: true,
        members: null,
    };

    /**
     * Indicates whether the component is mounted or not.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     */
    _isMounted = false;

    /**
     * Sets _isMounted to true
     * Gets the choir members
     */
    componentDidMount() {
        this._isMounted = true;

        // Gets the choir members
        this.getMembers();
    }

    /**
     * Sets _isMounted to false
     */
    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Gets the choir members from the server.
     * Updates state with the members.
     * @function
     */
    getMembers = () => {
        getChoirMembers({ choirId: this.props.choirId })
            .then((response) => {
                // Updates state
                if (this._isMounted) this.setState({ isLoading: false, members: response.data });
                // Gets each member's profile picture (this is async and will update the correct card when the picture comes in)
                this.getMembersProfilePictures();
            })
            .catch((error) => {
                // Logs an error
                choirMembersError(
                    error.response.status,
                    error.response.data,
                    "[ChoirMembers/getMembers]"
                );

                // Shows an error alert
                this.props.showAlert(alertBarTypes.ERROR, "Error", error.response.data);

                // Updates state
                if (this._isMounted) this.setState({ isLoading: false });
            });
    };

    /**
     * Gets each member's profile picture url.
     * Updates state with the url.
     * @function
     */
    getMembersProfilePictures = () => {
        if (this.state.members) {
            for (let i = 0; i < this.state.members.length; i++) {
                // Get the member (deep copy)
                const member = { ...this.state.members[i] };

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
                            const members = [...this.state.members];
                            members[i] = member;
                            this.setState({ members });
                        });
                }
            }
        }
    };

    /**
     * Gets an array of admin member cards and an array of student member cards
     * @function
     * @returns {object} An object containing an array of admin MemberCard components and an array of student MemberCard components
     */
    getMemberCards = () => {
        const admins = [];
        const students = [];

        if (this.state.members) {
            // Creates a member card for each member of the choir
            for (let i = 0; i < this.state.members.length; i++) {
                // Gets the current member
                const member = this.state.members[i];

                if (member.member_type === "admin") {
                    // Creates an admin member card
                    admins.push(this.createMemberCard(member, memberColorOptions.GREEN));
                } else {
                    // Creates a student member card
                    students.push(this.createMemberCard(member, memberColorOptions.ORANGE));
                }
            }
        }

        return { admins, students };
    };

    /**
     * Creates a member card component
     * @function
     * @param {object} member - The member data used to create the member card
     * @param {string} color - The color to use for the card
     * @returns {object} A MemberCard component
     */
    createMemberCard(member, color) {
        return (
            <MemberCard
                key={shortid.generate()}
                name={`${member.first_name} ${member.last_name}`}
                roles={member.member_role}
                profilePictureSrc={member.picture_url}
                color={color}
            />
        );
    }

    /**
     * Renders the ChoirMembers component
     * @returns {object} The JSX to render
     */
    render() {
        const { admins, students } = this.getMemberCards();

        // The component to display (loading or cards)
        let component;

        if (this.state.isLoading) {
            // Display a loading spinner
            component = <LoadingContainer message='Loading members...' />;
        } else {
            // Display the choir cards
            component = (
                <div>
                    <h1 className={styles.choirMembersMemberGroupHeading}>Administrators</h1>
                    <div className={styles.choirMembersCards}>{admins}</div>
                    <h1 className={styles.choirMembersMemberGroupHeading}>Students</h1>
                    <div className={styles.choirMembersCards}>{students}</div>
                </div>
            );
        }

        // Returns the JSX to render
        return (
            <div className={styles.choirMembers}>
                <PageHeader
                    heading={`${this.props.choirName} Members`}
                    shouldDisplayBackButton={true}
                    backButtonTitle={"Choir Selection"}
                />
                {component}
            </div>
        );
    }
}

// Prop types for the ChoirMembers component
ChoirMembers.propTypes = {
    /**
     * The id of the selected choir
     */
    choirId: PropTypes.string.isRequired,

    /**
     * The name of the selected choir
     */
    choirName: PropTypes.string.isRequired,

    /**
     * Shows an alert
     */
    showAlert: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the ChoirMembers component as props.
 * This function is used only by the react-redux connect function.
 * @memberof ChoirMembers
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the ChoirMembers component
 */
const mapStateToProps = (state) => {
    return {
        choirId: state.choirs.selectedChoirId,
        choirName: state.choirs.selectedChoirName,
    };
};

export default connect(mapStateToProps)(ChoirMembers);
