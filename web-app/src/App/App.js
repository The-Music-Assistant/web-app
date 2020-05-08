// NPM module imports
import React, {useEffect} from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
 * Renders the top level of the React app.
 * Sets up React Router.
 * @component
 * @category App
 * @author Dan Levy <danlevy124@gmail.com>
 */
const App = () => {
    /**
     * react-redux dispatch function
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Indicates whether app startup is done
     * @type {boolean}
     */
    const isStartupDone = useSelector(state => state.startup.isDone);

    /**
     * Indicates whether there exists an authenticated user
     * @type {boolean}
     */
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    /**
     * Indicates whether the authentication flow is complete (Sign in, sign up, or auth check)
     * @type {boolean}
     */
    const isAuthFlowComplete = useSelector(state => state.auth.isAuthFlowComplete);

    /**
     * Indicates whether this component should display the Welcome component
     * @type {boolean}
     */
    const shouldShowWelcomePage = useSelector(state => state.auth.shouldShowWelcomePage);

    /**
     * Sets the browser type (mobile or not mobile)
     */
    useEffect(() => {
        dispatch(setBrowserType(isMobileBrowser()));
    }, [dispatch]);

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
     * @returns {boolean} True is the browser is a mobile browser; false otherwise
     */
    const isMobileBrowser = () => {
        const userAgent = navigator.userAgent;
        return userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i) ||
            userAgent.match(/iPad/i) ||
            userAgent.match(/Android/i) ||
            userAgent.match(/webOS/i) ||
            userAgent.match(/BlackBerry/i) ||
            userAgent.match(/Windows Phone/i)
            ? true
            : false;
    };

    /**
     * Determines which url to redirect to.
     * Uses React Router's Redirect component.
     * @returns {Redirect} A Redirect component
     */
    const getRedirect = () => {
        if (!isStartupDone) {
            return <Redirect to="/startup" />;
        } else if (
            !isAuthenticated ||
            !isAuthFlowComplete
        ) {
            return <Redirect to="/auth" />;
        } else if (shouldShowWelcomePage) {
            return <Redirect to="/welcome" />;
        } else {
            return <Redirect to="/practice" />;
        }
    };

    /**
     * Determines which component to route to.
     * Uses React Router's Route component.
     * @returns {Route} A Route component
     */
    const getRoute = () => {
        if (!isStartupDone) {
            return (
                <Route>
                    <Startup />
                </Route>
            );
        } else if (
            !isAuthenticated ||
            !isAuthFlowComplete
        ) {
            return (
                <Route>
                    <Auth />
                </Route>
            );
        } else if (shouldShowWelcomePage) {
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
     */
    return (
        <BrowserRouter>
            <div className="app">
                {/* Redirects to the correct url */}
                {getRedirect()}

                {/* Determines which component to route to */}
                {getRoute()}
            </div>
        </BrowserRouter>
    );
}

export default App;
