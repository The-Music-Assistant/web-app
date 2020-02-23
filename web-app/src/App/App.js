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
import { Route, Switch, Redirect } from "react-router-dom";
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
     * Gets the page to render
     */
    getPage = () => {
        let page;

        if (this.props.isAuthenticated === null || !this.state.startupMinTimeElapsed) {
            page = (
                <div>
                    <Route path='/startup'>
                        <Startup />
                    </Route>
                    <Redirect to='/startup' />
                </div>
            );
        } else if (!this.props.isAuthenticated || !this.props.isAuthFlowComplete) {
            page = (
                <div>
                    <Route path='/auth'>
                        <Auth />
                    </Route>
                    <Redirect to='/auth' />
                </div>
            );
        } else if (this.props.showWelcomePage) {
            page = (
                <div>
                    <Route path='/welcome'>
                        <Welcome />
                    </Route>
                    <Redirect to='/welcome' />
                </div>
            );
        } else {
            page = (
                <div>
                    <Route path='/' exact>
                        <Primary />
                    </Route>
                    <Redirect to='/' />
                </div>
            );
        }

        return page;
    };

    /**
     * Renders the App component (this is the root component)
     */
    render() {
        return <div className='App'>{this.getPage()}</div>;
    }
}

/**
 * Gets the current state from Redux and passes it to the App component as props
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
