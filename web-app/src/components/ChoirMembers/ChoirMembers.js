// ----------------------------------------------------------------------------
// File Path: src/components/ChoirMembers/ChoirMembers.js
// Description: Renders the choir members component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 3/8/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import shortid from "shortid";
import { MetroSpinner } from "react-spinners-kit";
import {withRouter} from "react-router-dom";

// Component imports
import MemberCard from "./MemberCard/MemberCard";
import ChoirMembersHeader from "./ChoirMembersHeader/ChoirMembersHeader";

// File imports
import { getChoirMembers } from "../../vendors/AWS/tmaApi";
import firebase from "../../vendors/Firebase/firebase";
import * as memberColorOptions from "./MemberCard/colorOptions";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import { choirMembersError } from "../../vendors/Firebase/logs";

// Style imports
import styles from "./ChoirMembers.module.scss";

class ChoirMembers extends Component {
    // Component state
    state = {
        isLoading: true,
        members: null
    };

    // Flag that states whether the component is mounted or not
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

        // Gets the choir members
        this.getMembers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    /**
     * Gets the choir members from the server
     * Updates state with the members
     */
    getMembers = () => {
        getChoirMembers({ choirId: this.props.choirId })
            .then(response => {
                // Updates state
                if (this._isMounted) this.setState({ isLoading: false, members: response.data });
                // Gets the members' profile pictures (this is async and will update the correct card when the picture comes in)
                this.getMembersProfilePictures();
            })
            .catch(error => {
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
     * Gets the members' profile picture urls
     * Updates state with the url
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
                        .then(url => {
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

    backButtonClickedHandler = () => {
        this.props.history.goBack();
    };

    /**
     * Gets an array of admin member cards and an array of student member cards
     * @returns - An object containing an array of admins and an array of students
     */
    getMemberCards = () => {
        const admins = [];
        const students = [];

        if (this.state.members) {
            // Creates a member card for each member of the choir
            for (let i = 0; i < this.state.members.length; i++) {
                // The current member
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
     * @param {object} member - The member data used to create the member card
     * @param {*} color - The color to use for the card
     * @returns - A member card component
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

    // Renders the JSX
    render() {
        const { admins, students } = this.getMemberCards();

        // The component to display (loading or cards)
        let component;

        if (this.state.isLoading) {
            // Display a loading spinner
            component = (
                <div className={styles.choirMembersSpinner}>
                    <MetroSpinner size={75} color='#5F9CD1' loading={true} />
                    <h1 className={styles.choirMembersSpinnerMessage}>Loading members...</h1>
                </div>
            );
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
                <ChoirMembersHeader
                    heading={`${this.props.choirName} Members`}
                    backButtonClickedHandler={this.backButtonClickedHandler}
                />
                {component}
            </div>
        );
    }
}

// Prop types for the ChoirMembers component
ChoirMembers.propTypes = {
    choirId: PropTypes.string.isRequired,
    showAlert: PropTypes.func.isRequired
};

/**
 * Gets the current state from Redux and passes it to the App component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        choirId: state.choirs.selectedChoirId,
        choirName: state.choirs.selectedChoirName
    };
};

export default withRouter(connect(mapStateToProps)(ChoirMembers));
