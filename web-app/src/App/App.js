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
    retrievedUsersName,
    userAuthenticated,
    retrievedUsersPictureUrl,
    userNotAuthenticated,
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
     * Indicates if the initial authentication check is done
     * {[isInitialAuthCheckDone, setIsInitialAuthCheckDone]: [boolean, function]}
     */
    const [isInitialAuthCheckDone, setIsInitialAuthCheckDone] = useState(false);

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

                        setIsInitialAuthCheckDone(true);
                    });
            } else {
                // Clears the old Axios auth header token if there is one
                setAxiosAuthToken("");

                dispatch(userNotAuthenticated());

                setIsInitialAuthCheckDone(true);
            }
        });
    }, [dispatch]);

    /**
     * Determines which url to redirect to.
     * Uses React Router's Redirect component.
     * @returns {Redirect} A Redirect component
     */
    const getRedirect = () => {
        if (!isInitialAuthCheckDone) {
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
        if (!isInitialAuthCheckDone) {
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
