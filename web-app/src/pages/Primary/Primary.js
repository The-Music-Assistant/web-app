/* ----------------------------------------------------------------------------
// File Path: src/pages/Primary/Primary.js
// Description: Renders the primary page
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/30/2019
---------------------------------------------------------------------------- */

// NPM module imports
import React, { Component } from "react";
import AlertBar from "../../components/AlertBar/AlertBar";
import shortid from "shortid";

// Component imports
import Header from "../../components/Header/Header";
import MobileNav from "../../components/MobileNav/MobileNav";
import SideNav from "../../components/SideNav/SideNav";
import PracticeMain from "../../components/PracticeMain/PracticeMain";
import ChoirSelection from "../../components/ChoirSelection/ChoirSelection";
import Footer from "../../components/Footer/Footer";

// Image imports
// import homeIconBlue from "../../assets/icons/home-icon-blue-fa.svg";
import practiceIconBlue from "../../assets/icons/practice-icon-blue-fa.svg";
import progressIconBlue from "../../assets/icons/progress-icon-blue-fa.svg";
import choirIconBlue from "../../assets/icons/choir-icon-blue-fa.svg";
import messagesIconBlue from "../../assets/icons/messages-icon-blue-fa.svg";
// import homeIconWhite from "../../assets/icons/home-icon-white-fa.svg";
import practiceIconWhite from "../../assets/icons/practice-icon-white-fa.svg";
import progressIconWhite from "../../assets/icons/progress-icon-white-fa.svg";
import choirIconWhite from "../../assets/icons/choir-icon-white-fa.svg";
import messagesIconWhite from "../../assets/icons/messages-icon-white-fa.svg";

// Style imports
import styles from "./Primary.module.scss";

class Primary extends Component {
    // Creates main navigation tabs (links)
    constructor(props) {
        super(props);
        // this.generateMainNavTab("Home", homeIconBlue, homeIconWhite, false);
        this.generateMainNavTab("Practice", practiceIconBlue, practiceIconWhite, true);
        this.generateMainNavTab("Progress", progressIconBlue, progressIconWhite, false);
        this.generateMainNavTab("Choir", choirIconBlue, choirIconWhite, false);
        this.generateMainNavTab("Messages", messagesIconBlue, messagesIconWhite, false);
    }

    // Component state
    state = {
        isMobile: window.innerWidth < 768,
        showMobileNav: false,
        alertData: null
    };

    // Indicates whether the component is mounted or not
    _isMounted = false;

    // Main navigation tabs
    mainNavTabs = [];

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
     * Creates a main nav tab and pushes the tab to the array of main nav tabs
     * @param {string} name - The tab name
     * @param {string} mobileIcon - Icon to display on mobile devices
     * @param {string} desktopIcon - Icon to display on desktop devices
     * @param {boolean} isCurrent - Whether or not the tab is the current tab
     */
    generateMainNavTab = (name, mobileIcon, desktopIcon, isCurrent) => {
        const tab = {
            key: shortid.generate(),
            name,
            mobileIcon,
            desktopIcon,
            isCurrent
        };
        this.mainNavTabs.push(tab);
    };

    /**
     * Updates state when the window resizes
     */
    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth < 768 });
    };

    /**
     * Shows or hides the hamburger menu based on window size
     */
    handleShowHamburgerMenu = () => {
        this.setState(prevState => ({
            showMobileNav: !prevState.showMobileNav
        }));
    };

    /**
     * Sets alertData in state when a new alert is triggered
     */
    showAlertHandler = (type, heading, message) => {
        this.setState({
            alertData: { type, heading, message }
        });
    };

    /**
     * Sets alertData to null in state when the alert is done
     */
    alertIsDoneHandler = () => {
        this.setState({ alertData: null });
    };

    /**
     * Renders the Primary component
     */
    render() {
        // Creates the correct type of main navigation based on the window size
        let mainNav = null;
        if (this.state.isMobile) {
            mainNav = <MobileNav tabs={this.mainNavTabs} show={this.state.showMobileNav} />;
        } else {
            mainNav = <SideNav tabs={this.mainNavTabs} />;
        }

        // Returns the JSX to display
        return (
            <div className={styles.primary}>
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
                    isMobile={this.state.isMobile}
                />
                {mainNav}
                <ChoirSelection showAlert={this.showAlertHandler} />
                <Footer />
            </div>
        );
    }
}

export default Primary;
