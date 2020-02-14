/* ----------------------------------------------------------------------------
// File Path: src/App/App.js
// Description:
    * Renders the App
    * Handles routing to main pages
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// Component imports
import Startup from "../pages/Startup/Startup";
import Auth from "../pages/Auth/Auth";
import Welcome from "../pages/Welcome/Welcome";
import Primary from "../pages/Primary/Primary";

// Style imports
import "normalize.css";
import "./App.scss";

class App extends Component {
    // Component state
    // startupMinTimeElapsed indicates if the minimum time elapsed for starting up has occurred
    state = {
        startupMinTimeElapsed: false
    };

    /**
     * Starts a timer for elapsing startup time
     */
    componentDidMount() {
        setTimeout(() => {
            this.setState({ startupMinTimeElapsed: true });
        }, 2000);
    }

    /**
     * Renders the App component (this is the root component)
     */
    render() {
        // The page to display
        let page;

        if (this.props.isAuthenticated === null || !this.state.startupMinTimeElapsed) {
            // If startup is occurring, show the startup page
            page = (
                <div className='App'>
                    <Route path='/startup'>
                        <Startup />
                    </Route>
                    <Redirect to='/startup' />
                </div>
            );
        } else if (!this.props.isAuthenticated || !this.props.isAuthFlowComplete) {
            // If authentication needed or is already in progress, show the auth page
            page = (
                <div className='App'>
                    <Route path='/auth'>
                        <Auth />
                    </Route>
                    <Redirect to='/auth' />
                </div>
            );
        } else if (this.props.showWelcomePage) {
            // If a request has been made to show the welcome page, show it
            page = (
                <div className='App'>
                    <Route path='/welcome'>
                        <Welcome />
                    </Route>
                    <Redirect to='/welcome' />
                </div>
            );
        } else {
            // If the user is authenticated and no other data is needed, show the primary page
            page = (
                <div className='App'>
                    <Route path='/'>
                        <Primary />
                    </Route>
                    <Redirect to='/' />
                </div>
            );
        }

        // Returns the selected page
        return page;
    }
}

/**
 * Gets the current state from Redux and passes it to App as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isAuthFlowComplete: state.auth.isAuthFlowComplete,
        showWelcomePage: state.auth.showWelcomePage
    };
};

// Prop types for the App component
App.propTypes = {
    isAuthenticated: PropTypes.oneOfType([PropTypes.bool]),
    isAuthFlowComplete: PropTypes.oneOfType([PropTypes.bool]),
    showWelcomePage: PropTypes.bool
};

export default connect(mapStateToProps)(App);
