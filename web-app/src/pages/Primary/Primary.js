// NPM module imports
import React, { useState, useEffect, useCallback } from "react";
import shortid from "shortid";
import { Switch, Route } from "react-router-dom";

// Component imports
import AlertBar from "../../components/AlertBar/AlertBar";
import Header from "../../components/Header/Header";
import MobileNav from "../../components/MobileNav/MobileNav";
import SideNav from "../../components/SideNav/SideNav";
import Home from "../../components/Home/Home";
import Practice from "../../components/Practice/Practice";
import Progress from "../../components/Progress/Progress";
import Choirs from "../../components/Choirs/Choirs";
import Footer from "../../components/Footer/Footer";

// File imports
import firebase from "../../vendors/Firebase/firebase";

// Image imports
import homeIconBlue from "../../assets/icons/home-icon-blue.svg";
import practiceIconBlue from "../../assets/icons/practice-icon-blue.svg";
import progressIconBlue from "../../assets/icons/progress-icon-blue.svg";
import choirIconBlue from "../../assets/icons/choir-icon-blue.svg";
import homeIconWhite from "../../assets/icons/home-icon-white.svg";
import practiceIconWhite from "../../assets/icons/practice-icon-white.svg";
import progressIconWhite from "../../assets/icons/progress-icon-white.svg";
import choirIconWhite from "../../assets/icons/choir-icon-white.svg";

// Style imports
import styles from "./Primary.module.scss";

/**
 * Renders the Primary component.
 * This is the container component for all of the components that should include a header, sidebar, and footer.
 * @component
 * @category Primary
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Primary = () => {
    /**
     * Creates a main navigation tab
     * @param {string} name - The tab name
     * @param {string} blueIcon - A blue version of the icon
     * @param {string} whiteIcon - A white version of the icon
     * @param {boolean} isCurrent - Indicates whether the tab is the current tab
     * @returns {object} A tab (data only, not JSX)
     */
    const getMainNavTab = (name, route, blueIcon, whiteIcon, isCurrentTab) => {
        return {
            key: shortid.generate(),
            name,
            route,
            blueIcon,
            whiteIcon,
            isCurrentTab,
        };
    };

    /**
     * Generates the main navigation tabs
     * @returns {array} An array of navigation tabs (data only, not JSX)
     */
    const getMainNavTabs = () => {
        const tabs = [];

        tabs.push(
            getMainNavTab("Home", "/home", homeIconBlue, homeIconWhite, false)
        );
        tabs.push(
            getMainNavTab(
                "Practice",
                "/practice",
                practiceIconBlue,
                practiceIconWhite,
                true
            )
        );
        tabs.push(
            getMainNavTab(
                "Progress",
                "/progress",
                progressIconBlue,
                progressIconWhite,
                false
            )
        );
        tabs.push(
            getMainNavTab(
                "Choirs",
                "/choirs",
                choirIconBlue,
                choirIconWhite,
                false
            )
        );

        return tabs;
    };

    /**
     * Indicates if the screen width is mobile (i.e. < 768px)
     * {[isMobileScreenWidth, setIsMobileScreenWidth]: [number, function]}
     */
    const [isMobileScreenWidth, setIsMobileScreenWidth] = useState(
        window.innerWidth < 768
    );

    /**
     * Indicates if the mobile navigation should be shown
     * {[shouldShowMobileNav, setShouldShowMobileNav]: [boolean, function]}
     */
    const [shouldShowMobileNav, setShouldShowMobileNav] = useState(false);

    /**
     * Data used to display an alert
     * {[alertData, setAlertData]: [object, function]}
     * {module:alertBarTypes} alertData.type - The type of alert bar to show
     * {string} alertData.heading - The alert heading
     * {string} alertData.message - The alert message
     */
    const [alertData, setAlertData] = useState(null);

    /**
     * Main navigation tabs
     * {[mainNavTabs, setMainNavTabs]: [array, function]}
     */
    const [mainNavTabs, setMainNavTabs] = useState(getMainNavTabs());

    /**
     * The copyright year for the app
     * @type {string}
     */
    const COPYRIGHT_YEAR = "2020";

    /**
     * The current app version number
     * @type {string}
     */
    const VERSION_NUMBER = "0.0.12";

    /**
     * Adds a window resize listener
     * @returns {function} A cleanup function that removes the window resize listener
     */
    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    });

    /**
     * Updates state when the window resizes
     */
    const handleWindowResize = () => {
        setIsMobileScreenWidth(window.innerWidth < 768);
    };

    /**
     * Shows or hides the hamburger menu
     */
    const showHideHamburgerMenu = () => {
        setShouldShowMobileNav((prevState) => !prevState);
    };

    /**
     * Gets the main navigation based on the screen size
     * @returns {object} - A JSX element representing the main navigation
     */
    const getMainNav = () => {
        if (isMobileScreenWidth) {
            // Returns the mobile navigation component
            return (
                <MobileNav
                    tabs={mainNavTabs}
                    show={shouldShowMobileNav}
                    onNavLinkClick={(key) => {
                        showHideHamburgerMenu();
                        navLinkClickedHandler(key);
                    }}
                    onSignOutClick={signOutClickedHandler}
                />
            );
        } else {
            // Returns the side navigation component
            return (
                <SideNav
                    tabs={mainNavTabs}
                    onNavLinkClick={navLinkClickedHandler}
                    onSignOutClick={signOutClickedHandler}
                    copyrightYear={COPYRIGHT_YEAR}
                    versionNumber={VERSION_NUMBER}
                />
            );
        }
    };

    /**
     * Gets confirmation from user and then signs the user out.
     * The Firebase auth change observer will handle any other actions.
     */
    const signOutClickedHandler = () => {
        if (window.confirm("Do you want to sign out?")) {
            firebase.auth().signOut();
        }
    };

    /**
     * Updates the isCurrentTab boolean for all main navigation tabs based on the tab that was clicked on.
     * Updates state with the new tabs (data only, not JSX)
     * @param {string} key - The key of the tab that was clicked on (uses the same key prop that React uses)
     */
    const navLinkClickedHandler = (key) => {
        setMainNavTabs((prevState) => {
            // Makes a deep copy of the old main nav tabs
            const oldTabs = [...prevState];

            // Generates the new main nav tabs
            const newTabs = oldTabs.map((tab) => {
                // Makes a deep copy of the tab
                const newTab = { ...tab };

                // Updates isCurrentTab boolean
                if (tab.key === key) {
                    newTab.isCurrentTab = true;
                } else {
                    newTab.isCurrentTab = false;
                }

                return newTab;
            });

            // Updates state with the new tabs
            return newTabs;
        });
    };

    /**
     * Sets alertData in state when a new alert is triggered
     * @param {alertBarTypes} - The type of alert bar to show
     * @param {string} - The alert heading
     * @param {string} - The alert message
     */
    const showAlertHandler = useCallback((type, heading, message) => {
        setAlertData({ type, heading, message });
    }, []);

    /**
     * Sets alertData in state to null in state when the alert disappears
     */
    const alertIsDoneHandler = useCallback(() => {
        // useCallback is used to ensure that the AlertBar is not re-rendered each time this component updates
        setAlertData(null);
    }, []);

    // Renders the Primary component
    return (
        <div className={styles.primary}>
            {/* Shows an alert if one exists */}
            {alertData ? (
                <AlertBar
                    type={alertData.type}
                    heading={alertData.heading}
                    message={alertData.message}
                    done={alertIsDoneHandler}
                />
            ) : null}

            {/* Header */}
            <Header
                onHamburgerMenuClick={showHideHamburgerMenu}
                isMobileScreenWidth={isMobileScreenWidth}
            />

            {/* Main navigation */}
            {getMainNav()}

            <Switch>
                {/* Shows the Home component */}
                <Route path="/home">
                    <Home />
                </Route>

                {/* Shows the Practice component */}
                <Route path="/practice">
                    <Practice showAlert={showAlertHandler} />
                </Route>

                {/* Shows the Progress component */}
                <Route path="/progress">
                    <Progress />
                </Route>

                {/* Shows the Choirs component */}
                <Route path="/choirs">
                    <Choirs showAlert={showAlertHandler} />
                </Route>
            </Switch>

            {/* Displays a footer on mobile screen sizes */}
            {isMobileScreenWidth ? (
                <Footer
                    copyrightYear={COPYRIGHT_YEAR}
                    versionNumber={VERSION_NUMBER}
                />
            ) : null}
        </div>
    );
};

export default Primary;
