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
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
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
    /**
     * Gets the page to render
     */
    getRedirect = () => {
        let redirect;

        if (!this.props.isStartupDone) {
            redirect = <Redirect to='/startup' />;
        } else if (!this.props.isAuthenticated || !this.props.isAuthFlowComplete) {
            redirect = <Redirect to='/auth' />;
        } else if (this.props.showWelcomePage) {
            redirect = <Redirect to='/welcome' />;
        } else {
            redirect = <Redirect to='/sheet-music' />;
        }

        console.log(redirect);

        return redirect;
    };

    /**
     * Renders the App component (this is the root component)
     */
    render() {
        return (
            <BrowserRouter>
                <div className='App'>
                    {this.getRedirect()}
                    <Switch>
                        <Route path='/startup'>
                            <Startup />
                        </Route>
                        {this.props.isStartupDone ? <Route component={Auth} path='/auth' /> : null}
                        {this.props.isStartupDone ? (
                            <Route component={Welcome} path='/welcome' />
                        ) : null}
                        {this.props.isStartupDone ? (
                            <Route component={Primary} path='/sheet-music' />
                        ) : null}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

/**
 * Gets the current state from Redux and passes it to the App component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        isStartupDone: state.startup.isDone,
        isAuthenticated: state.auth.isAuthenticated,
        isAuthFlowComplete: state.auth.isAuthFlowComplete,
        showWelcomePage: state.auth.showWelcomePage
    };
};

// Prop types for the App component
App.propTypes = {
    isStartupDone: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    isAuthFlowComplete: PropTypes.bool,
    showWelcomePage: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(App);
