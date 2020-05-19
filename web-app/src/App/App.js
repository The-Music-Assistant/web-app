// NPM module imports
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Component imports
import Startup from "../pages/Startup/Startup";
import Auth from "../pages/Auth/Auth";
import Welcome from "../pages/Welcome/Welcome";
import Primary from "../pages/Primary/Primary";

// File imports
import firebase, { getUserId } from "../vendors/Firebase/firebase";
import { setAxiosAuthToken, getUser } from "../vendors/AWS/tmaApi";
import {
    setBrowserType,
    retrievedUsersName,
    userAuthenticated,
    retrievedUsersPictureUrl,
} from "../store/actions/index";

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
     * Indicates whether there exists an authenticated user
     * @type {boolean}
     */
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    /**
     * Indicates whether the user's email is verified
     * {[isUserEmailVerified, setIsUserEmailVerified]: [boolean, function]}
     */
    const [isUserEmailVerified, setIsUserEmailVerified] = useState(false);

    /**
     * Indicates whether the authentication flow is complete (Sign in, sign up, or auth check)
     * @type {boolean}
     */
    const isAuthFlowComplete = useSelector(
        (state) => state.auth.isAuthFlowComplete
    );

    /**
     * Sets the browser type (mobile or not mobile)
     */
    useEffect(() => {
        dispatch(setBrowserType(isMobileBrowser()));
    }, [dispatch]);

    /**
     * Listens for auth changes.
     * If a user exists:
     * Gets the user's full name and profile picture.
     */
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // Sets the Axios auth header with the user's id token
                getUserId()
                    .then(setAxiosAuthToken)
                    .catch(() => setAxiosAuthToken(""))
                    .then(getUser)
                    .then((snapshot) => {
                        // Sets the user's name
                        dispatch(
                            retrievedUsersName(
                                `${snapshot.data.first_name} ${snapshot.data.last_name}`
                            )
                        );

                        return snapshot.data.has_picture;
                    })
                    .then((hasProfilePicture) => {
                        if (hasProfilePicture) {
                            // Gets the user's profile picture URL
                            return firebase
                                .storage()
                                .ref()
                                .child(
                                    `users/${user.uid}/profile_picture_200x200`
                                )
                                .getDownloadURL();
                        }
                    })
                    .then((url) => {
                        // Updates state with the picture URL
                        dispatch(retrievedUsersPictureUrl(url));
                    })
                    .then(() => {
                        user.emailVerified
                            ? setIsUserEmailVerified(true)
                            : setIsUserEmailVerified(false);

                        dispatch(userAuthenticated());
                    });
            } else {
                // Clears the old Axios auth header token if there is one
                setAxiosAuthToken("");
            }
        });
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
        if (!isAuthenticated) {
            return <Redirect to="/startup" />;
        } else if (!isAuthenticated || !isAuthFlowComplete) {
            return <Redirect to="/auth" />;
        } else if (!isUserEmailVerified) {
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
        if (!isAuthenticated) {
            return (
                <Route>
                    <Startup />
                </Route>
            );
        } else if (!isAuthenticated || !isAuthFlowComplete) {
            return (
                <Route>
                    <Auth />
                </Route>
            );
        } else if (!isUserEmailVerified) {
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

    // Renders the App component
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
};

export default App;
