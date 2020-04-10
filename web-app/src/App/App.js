// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// Component imports
import Startup from "../pages/Startup/Startup";
import Auth from "../pages/Auth/Auth";
import Welcome from "../pages/Welcome/Welcome";
import Primary from "../pages/Primary/Primary";

// File imports
import { setBrowserType } from "../store/actions/index";

// Style imports
import "normalize.css";
import "./App.scss";

/**
 * Renders the top level of the React app
 * @author Dan Levy <danlevy124@gmail.com>
 * @extends {Component}
 * @component
 */
class App extends Component {
    /**
     * Sets the browser type (mobile or not mobile)
     */
    componentDidMount() {
        this.props.setBrowserType(this.isMobileBrowser());
    }

    /**
     * Determines if the browser is mobile or not.
     * Mobile device check includes:
     * iPhone,
     * iPod,
     * iPad (pre-iPad OS),
     * Android,
     * WebOS (Palm phone),
     * BlackBerry, and
     * Windows Phone.
     * @function
     * @returns {boolean} - True is the browser is a mobile browser; false otherwise
     */
    isMobileBrowser = () => {
        const userAgent = navigator.userAgent;
        return (
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i) ||
            userAgent.match(/iPad/i) ||
            userAgent.match(/Android/i) ||
            userAgent.match(/webOS/i) ||
            userAgent.match(/BlackBerry/i) ||
            userAgent.match(/Windows Phone/i)
        );
    };

    /**
     * Determines which url to redirect to.
     * Uses React Router's Redirect component.
     * @function
     * @returns {Redirect} A Redirect component
     */
    getRedirect = () => {
        if (!this.props.isStartupDone) {
            return <Redirect to='/startup' />;
        } else if (!this.props.isAuthenticated || !this.props.isAuthFlowComplete) {
            return <Redirect to='/auth' />;
        } else if (this.props.shouldShowWelcomePage) {
            return <Redirect to='/welcome' />;
        } else {
            return <Redirect to='/practice' />;
        }
    };

    /**
     * Determines which component to route to.
     * Uses React Router's Route component.
     * @function
     * @returns {Route} A Route component
     */
    getRoute = () => {
        if (!this.props.isStartupDone) {
            return (
                <Route>
                    <Startup />
                </Route>
            );
        } else if (!this.props.isAuthenticated || !this.props.isAuthFlowComplete) {
            return (
                <Route>
                    <Auth />
                </Route>
            );
        } else if (this.props.shouldShowWelcomePage) {
            return (
                <Route>
                    <Welcome />
                </Route>
            );
        } else {
            return (
                <Route>
                    <Primary />
                </Route>
            );
        }
    };

    /**
     * Renders the App component
     * @returns The JSX to render
     */
    render() {
        return (
            <BrowserRouter>
                <div className='app'>
                    {/* Redirects to the correct url */}
                    {this.getRedirect()}

                    {/* Determines which component to route to */}
                    {this.getRoute()}
                </div>
            </BrowserRouter>
        );
    }
}

// Prop types for the App component
App.propTypes = {
    /**
     * Indicates whether app startup is done
     */
    isStartupDone: PropTypes.bool.isRequired,

    /**
     * Indicates whether there exists an authenticated user
     */
    isAuthenticated: PropTypes.bool,

    /**
     * Indicates whether the authentication flow is complete (Sign in, sign up, or auth check)
     */
    isAuthFlowComplete: PropTypes.bool,

    /**
     * Indicates whether this component should display the Welcome component
     */
    shouldShowWelcomePage: PropTypes.bool.isRequired,

    /**
     * Sets the browser type (mobile or desktop) in Redux
     */
    setBrowserType: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the App component as props.
 * This function is used only by the react-redux connect function.
 * @memberof App
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the App component
 */
const mapStateToProps = (state) => {
    return {
        isStartupDone: state.startup.isDone,
        isAuthenticated: state.auth.isAuthenticated,
        isAuthFlowComplete: state.auth.isAuthFlowComplete,
        shouldShowWelcomePage: state.auth.shouldShowWelcomePage,
    };
};

/**
 * Passes certain Redux actions to the App component as props.
 * This function is used only by the react-redux connect function.
 * @memberof App
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the App component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        setBrowserType: (isMobileBrowser) => dispatch(setBrowserType(isMobileBrowser)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
