// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import shortid from "shortid";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

// Component imports
import Header from "../../components/Header/Header";
import MobileNav from "../../components/MobileNav/MobileNav";
import SideNav from "../../components/SideNav/SideNav";
import ChoirSelection from "../../components/ChoirSelection/ChoirSelection";
import MusicSelection from "../../components/MusicSelection/MusicSelection";
import AlertBar from "../../components/AlertBar/AlertBar";
import Home from "../../components/Home/Home";
import Music from "../../components/Music/Music";
import Progress from "../../components/Progress/Progress";
import ChoirMembers from "../../components/ChoirMembers/ChoirMembers";
import Footer from "../../components/Footer/Footer";

// File imports
import { signOut } from "../../store/actions";
import * as choirSelectionRoutingOptions from "../../components/ChoirSelection/routingOptions";

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
 * @extends {Component}
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class Primary extends Component {
    /**
     * Sets up state
     * @param {object} props - See PropTypes
     */
    constructor(props) {
        super(props);

        /**
         * Primary component state
         * @property {boolean} isMobileScreenSize - Indicates if the screen width is mobile (i.e. < 768px)
         * @property {boolean} showMobileNav - Indicates if the mobile navigation should be shown
         * @property {object|null} alertData - Data used to display an alert
         * @property {module:alertBarTypes} alertData.type - The type of alert bar to show
         * @property {string} alertData.heading - The alert heading
         * @property {string} alertData.message - The alert message
         */
        this.state = {
            isMobileScreenSize: window.innerWidth < 768,
            showMobileNav: false,
            alertData: null,
            mainNavTabs: this.getMainNavTabs(),
        };
    }

    /**
     * Indicates whether the component is mounted or not.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     */
    _isMounted = false;

    /**
     * Creates an event listener for window resize
     */
    componentDidMount() {
        this._isMounted = true;
        window.addEventListener("resize", this.handleWindowResize);
    }

    /**
     * Removes the window event resize event listener
     */
    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener("resize", this.handleWindowResize);
    }

    /**
     * Generates the main navigation tabs
     * @function
     * @returns {array} An array of navigation tabs (data only, not JSX)
     */
    getMainNavTabs = () => {
        const tabs = [];

        tabs.push(this.getMainNavTab("Home", "/home", homeIconBlue, homeIconWhite, false));
        tabs.push(
            this.getMainNavTab("Practice", "/practice", practiceIconBlue, practiceIconWhite, true)
        );
        tabs.push(
            this.getMainNavTab("Progress", "/progress", progressIconBlue, progressIconWhite, false)
        );
        tabs.push(this.getMainNavTab("Choirs", "/choirs", choirIconBlue, choirIconWhite, false));

        return tabs;
    };

    /**
     * Creates a main navigation tab
     * @function
     * @param {string} name - The tab name
     * @param {string} blueIcon - A blue version of the icon
     * @param {string} whiteIcon - A white version of the icon
     * @param {boolean} isCurrent - Indicates whether the tab is the current tab
     * @returns {object} A tab (data only, not JSX)
     */
    getMainNavTab = (name, route, blueIcon, whiteIcon, isCurrentTab) => {
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
     * Updates state when the window resizes
     * @function
     */
    handleWindowResize = () => {
        this.setState({ isMobileScreenSize: window.innerWidth < 768 });
    };

    /**
     * Shows or hides the hamburger menu based on window size
     * @function
     */
    handleShowHamburgerMenu = () => {
        this.setState((prevState) => ({
            showMobileNav: !prevState.showMobileNav,
        }));
    };

    /**
     * Gets confirmation from user and then signs the user out
     * @function
     */
    signOutClickedHandler = () => {
        if (window.confirm("Do you want to sign out?")) {
            this.props.signOut();
        }
    };

    /**
     * Updates the isCurrentTab boolean for all main navigation tabs based on the tab that was clicked on.
     * Updates state with the new tabs (data only, not JSX)
     * @function
     * @param {string} key - The key of the tab that was clicked on (uses the same key prop that React uses)
     */
    navLinkClickedHandler = (key) => {
        if (this._isMounted) {
            this.setState((prevState) => {
                // Makes a deep copy of the old main nav tabs
                const oldTabs = [...prevState.mainNavTabs];

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
                return { mainNavTabs: newTabs };
            });
        }
    };

    /**
     * Sets alertData in state when a new alert is triggered
     * @function
     * @param {alertBarTypes} - The type of alert bar to show
     * @param {string} - The alert heading
     * @param {string} - The alert message
     */
    showAlertHandler = (type, heading, message) => {
        this.setState({
            alertData: { type, heading, message },
        });
    };

    /**
     * Sets alertData in state to null in state when the alert disappears
     * @function
     */
    alertIsDoneHandler = () => {
        this.setState({ alertData: null });
    };

    /**
     * Gets the main navigation based on the screen size
     * @function
     * @returns {object} - A JSX element representing the main navigation
     */
    getMainNav = () => {
        if (this.state.isMobileScreenSize) {
            // Returns the mobile navigation component
            return (
                <MobileNav
                    tabs={this.state.mainNavTabs}
                    show={this.state.showMobileNav}
                    navLinkClicked={(key) => {
                        this.handleShowHamburgerMenu();
                        this.navLinkClickedHandler(key);
                    }}
                    signOutClicked={this.signOutClickedHandler}
                />
            );
        } else {
            // Returns the side navigation component
            return (
                <SideNav
                    tabs={this.state.mainNavTabs}
                    signOutClicked={this.signOutClickedHandler}
                    navLinkClicked={this.navLinkClickedHandler}
                />
            );
        }
    };

    /**
     * Renders the Primary component
     * @returns {object} The JSX to render
     */
    render() {
        return (
            <div className={styles.primary}>
                {/* Shows an alert if one exists */}
                {this.state.alertData ? (
                    <AlertBar
                        type={this.state.alertData.type}
                        heading={this.state.alertData.heading}
                        message={this.state.alertData.message}
                        done={this.alertIsDoneHandler}
                    />
                ) : null}

                <Header
                    hamburgerMenuClicked={this.handleShowHamburgerMenu}
                    isMobileScreenSize={this.state.isMobileScreenSize}
                />

                {/* The main navigation */}
                {this.getMainNav()}

                {/* Determines which component to display */}
                <Switch>
                    <Route path='/practice/choirs/:choirId/music/:musicId'>
                        <Music showAlert={this.showAlertHandler} />
                    </Route>

                    <Route path='/practice/choirs/:choirId'>
                        <MusicSelection showAlert={this.showAlertHandler} />
                    </Route>

                    <Route path='/choirs/:choirId'>
                        <ChoirMembers showAlert={this.showAlertHandler} />
                    </Route>

                    <Route path='/practice'>
                        <ChoirSelection
                            routing={choirSelectionRoutingOptions.MUSIC_SELECTION}
                            showAlert={this.showAlertHandler}
                        />
                    </Route>

                    <Route path='/progress'>
                        <Progress />
                    </Route>

                    <Route path='/choirs'>
                        <ChoirSelection
                            routing={choirSelectionRoutingOptions.CHOIR_MEMBERS}
                            showAlert={this.showAlertHandler}
                        />
                    </Route>

                    <Route path='/home'>
                        <Home />
                    </Route>
                </Switch>

                {/* Displays a footer on mobile screen sizes */}
                {this.state.isMobileScreenSize ? <Footer /> : null}
            </div>
        );
    }
}

// Prop types for the Primary component
Primary.propTypes = {
    /**
     * Signs the user out
     */
    signOut: PropTypes.func.isRequired,
};

/**
 * Passes certain Redux actions to the Primary component as props.
 * This function is used only by the react-redux connect function.
 * @memberof Primary
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the Primary component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut()),
    };
};

export default connect(null, mapDispatchToProps)(Primary);
