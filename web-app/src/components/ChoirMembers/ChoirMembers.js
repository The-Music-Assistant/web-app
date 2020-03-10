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

// Component imports
import MemberCard from "./MemberCard/MemberCard";

// File imports
import { getChoirMembers } from "../../App/musicAssistantApi";
import * as memberColorOptions from "./MemberCard/colorOptions";

// Style imports
import styles from "./ChoirMembers.module.scss";

class ChoirMembers extends Component {
    // Component state
    state = {
        isLoading: true,
        members: null
    };

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

        getChoirMembers({ choirId: this.props.choirId }).then(response => {
            console.log(response.data);
            if (this._isMounted) this.setState({ members: response.data });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Renders JSX
    render() {
        const admins = [];
        const students = [];

        if (this.state.members) {
            for (const member of this.state.members) {
                console.log(member.member_type);
                if (member.member_type === "admin") {
                    admins.push(
                        <MemberCard
                            key={shortid.generate()}
                            name={`${member.first_name} ${member.last_name}`}
                            roles={member.member_role}
                            profilePictureSrc={null}
                            color={memberColorOptions.GREEN}
                        />
                    );
                } else {
                    students.push(
                        <MemberCard
                            key={shortid.generate()}
                            name={`${member.first_name} ${member.last_name}`}
                            roles={member.member_role}
                            profilePictureSrc={null}
                            color={memberColorOptions.PRIMARY_BLUE}
                        />
                    );
                }
            }
        }

        return (
            <div className={styles.choirMembers}>
                {admins}
                {students}
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
        choirId: state.choirs.selectedChoirId
    };
};

export default connect(mapStateToProps)(ChoirMembers);
