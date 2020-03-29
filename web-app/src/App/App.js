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

// File imports
import { setBrowserType } from "../store/actions";

// Style imports
import "normalize.css";
import "./App.scss";

class App extends Component {
    constructor(props) {
        super(props);

        // Sets the browser type (mobile or not mobile)
        this.props.setBrowserType(this.isMobileBrowser());
    }

    /**
     * Determines if the browser is mobile or not
     * Mobile device check includes:
     * iPhone
     * iPod
     * iPad (pre-iPad OS)
     * Android
     * WebOS (Palm phone)
     * BlackBerry
     * Windows Phone
     * @returns - True is the browser is a mobile browser; false otherwise
     */
    isMobileBrowser = () => {
        const userAgent = navigator.userAgent;
        if (
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i) ||
            userAgent.match(/iPad/i) ||
            userAgent.match(/Android/i) ||
            userAgent.match(/webOS/i) ||
            userAgent.match(/BlackBerry/i) ||
            userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Gets the page to render
     */
    getRedirect = () => {
        let redirect;

        if (!this.props.isStartupDone) {
            redirect = <Redirect to='/startup' />;
        } else if (!this.props.isAuthenticated || !this.props.isAuthFlowComplete) {
            redirect = <Redirect to='/auth' />;
        } else if (this.props.shouldShowWelcomePage) {
            redirect = <Redirect to='/welcome' />;
        } else {
            redirect = <Redirect to='/practice' />;
        }

        return redirect;
    };

    /**
     * Renders the App component (this is the root component)
     */
    render() {
        return (
            <BrowserRouter>
                <div className='app'>
                    {this.getRedirect()}
                    <Switch>
                        <Route path='/startup'>
                            <Startup />
                        </Route>
                        {this.props.isStartupDone ? <Route component={Auth} path='/auth' /> : null}
                        {this.props.isStartupDone ? (
                            <Route component={Welcome} path='/welcome' />
                        ) : null}
                        {this.props.isStartupDone ? <Route component={Primary} path='/' /> : null}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

// Prop types for the App component
App.propTypes = {
    isStartupDone: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool,
    isAuthFlowComplete: PropTypes.bool,
    shouldShowWelcomePage: PropTypes.bool.isRequired,
    setBrowserType: PropTypes.func.isRequired
};

/**
 * Gets the current state from Redux and passes it to the App component as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        isStartupDone: state.startup.isDone,
        isAuthenticated: state.auth.isAuthenticated,
        isAuthFlowComplete: state.auth.isAuthFlowComplete,
        shouldShowWelcomePage: state.auth.shouldShowWelcomePage
    };
};

/**
 * Passes certain redux actions to the App component
 * @param {function} dispatch - The react-redux dispatch function
 */
const mapDispatchToProps = dispatch => {
    return {
        setBrowserType: isMobileBrowser => dispatch(setBrowserType(isMobileBrowser))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
