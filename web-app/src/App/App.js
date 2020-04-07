// NPM module imports
import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
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
 * @component
 */
const App = (props) => {
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
     * @returns {boolean} - True is the browser is a mobile browser; false otherwise
     */
    const isMobileBrowser = () => {
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

    // Sets the browser type (mobile or not mobile)
    props.setBrowserType(isMobileBrowser());

    /**
     * Determines which url to redirect to.
     * Uses React Router's Redirect component.
     * @returns {Redirect} A Redirect component
     */
    const getRedirect = () => {
        if (!props.isStartupDone) {
            return <Redirect to='/startup' />;
        } else if (!props.isAuthenticated || !props.isAuthFlowComplete) {
            return <Redirect to='/auth' />;
        } else if (props.shouldShowWelcomePage) {
            return <Redirect to='/welcome' />;
        } else {
            return <Redirect to='/practice' />;
        }
    };

    // Returns the JSX to render
    return (
        <BrowserRouter>
            <div className='app'>
                {/* Redirects to the correct url */}
                {getRedirect()}

                {/* Determines which component to display */}
                <Switch>
                    {props.isStartupDone
                        ? ({
                              /* Protected routes */
                          },
                          [
                              <Route key={1} path='/auth'>
                                  <Auth />
                              </Route>,
                              <Route key={2} path='/welcome'>
                                  <Welcome />
                              </Route>,
                              <Route key={3} path='/'>
                                  <Primary />
                              </Route>,
                          ])
                        : ({
                              /* Public route */
                          },
                          (
                              <Route>
                                  <Startup />
                              </Route>
                          ))}
                </Switch>
            </div>
        </BrowserRouter>
    );
};

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
