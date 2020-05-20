// NPM module imports
import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

// Component imports
import Startup from "../pages/Startup/Startup";
import Auth from "../pages/Auth/Auth";
import Welcome from "../pages/Welcome/Welcome";
import Primary from "../pages/Primary/Primary";

// Context Imports
import GlobalStateContext from "./GlobalStateContext";

// File imports
import firebase, { getUserId } from "../vendors/Firebase/firebase";
import { setAxiosAuthToken, getUser } from "../vendors/AWS/tmaApi";

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
     * Indicates if the initial authentication check is done
     * {[isInitialAuthCheckDone, setIsInitialAuthCheckDone]: [boolean, function]}
     */
    const [isInitialAuthCheckDone, setIsInitialAuthCheckDone] = useState(false);

    /**
     * Indicates if a user is authenticated
     * {[isAuthenticated, setIsAuthenticated]: [boolean, function]}
     */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * The user's full name
     * {[userFullName, setUserFullName]: [string, function]}
     */
    const [userFullName, setUserFullName] = useState("");

    /**
     * The user's profile picture URL
     * {[userPictureUrl, setUserPictureUrl]: [string, function]}
     */
    const [userPictureUrl, setUserPictureUrl] = useState("");

    /**
     * Indicates whether the user's email is verified
     * {[isUserEmailVerified, setIsUserEmailVerified]: [boolean, function]}
     */
    const [isUserEmailVerified, setIsUserEmailVerified] = useState(false);

    /**
     * Indicates whether the authentication flow is complete (Sign in or sign up)
     * {[isAuthFlowComplete, setIsAuthFlowComplete]: [boolean, function]}
     */
    const [isAuthFlowComplete, setIsAuthFlowComplete] = useState(true);

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
                    .then(() => getUserData(user.uid))
                    .then(() => {
                        user.emailVerified
                            ? setIsUserEmailVerified(true)
                            : setIsUserEmailVerified(false);

                        setIsAuthenticated(true);

                        setIsInitialAuthCheckDone(true);
                    });
            } else {
                // Clears the old Axios auth header token if there is one
                setAxiosAuthToken("");

                setIsAuthenticated(false);

                setIsAuthFlowComplete(false);
                setIsInitialAuthCheckDone(true);
            }
        });
    }, []);

    /**
     * Gets the user's full name and profile picture URL.
     * Updates state with this data.
     * @param {string} userUid - The UID of the current user
     */
    const getUserData = async (userUid) => {
        getUser()
            .then((snapshot) => {
                // Updates state with the user's name
                setUserFullName(
                    `${snapshot.data.first_name} ${snapshot.data.last_name}`
                );

                return snapshot.data.has_picture;
            })
            .then((hasProfilePicture) => {
                if (hasProfilePicture) {
                    // Gets the user's profile picture URL
                    return firebase
                        .storage()
                        .ref()
                        .child(`users/${userUid}/profile_picture_200x200`)
                        .getDownloadURL();
                }
            })
            .then((url) => {
                // Updates state with the picture URL
                setUserPictureUrl(url);
            });
    };

    /**
     * Updates state indicating that the auth flow is complete.
     * Updates state with user data if needed.
     * @param {boolean} isSignUpFlow - Indicates if the auth flow is the sign up flow
     */
    const authDoneHandler = useCallback((isSignUpFlow) => {
        setIsAuthFlowComplete(true);

        if (isSignUpFlow) {
            // Gets updated user data that was entered in the Profile component
            getUserData(firebase.auth().currentUser.uid);
        }
    }, []);

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
                    <Auth done={authDoneHandler} />
                </Route>
            );
        } else if (!isUserEmailVerified) {
            return (
                <Route>
                    <Welcome done={() => setIsUserEmailVerified(true)} />
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
        <GlobalStateContext.Provider
            value={{ isAuthenticated, userFullName, userPictureUrl }}
        >
            <BrowserRouter>
                <div className="app">
                    {/* Redirects to the correct url */}
                    {getRedirect()}

                    {/* Determines which component to route to */}
                    {getRoute()}
                </div>
            </BrowserRouter>
        </GlobalStateContext.Provider>
    );
};

export default App;
