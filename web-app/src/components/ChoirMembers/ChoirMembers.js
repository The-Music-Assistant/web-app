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

// Component imports
import MemberCard from "./MemberCard/MemberCard";

// File imports
import { getChoirMembers } from "../../App/musicAssistantApi";

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

        getChoirMembers(this.props.choirId).then(response => {
            console.log(response.data);
            if (this._isMounted) this.setState({ members: response.data });
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Renders JSX
    render() {
        return <div className={styles.choirMembers}></div>;
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
