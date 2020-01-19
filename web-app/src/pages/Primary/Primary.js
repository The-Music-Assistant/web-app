/* ----------------------------------------------------------------------------
// File Path: src/pages/Primary/Primary.js
// Description: Renders the primary page (the main dashboard)
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/30/2019
---------------------------------------------------------------------------- */

import React, { Component } from "react";
import shortid from "shortid";
import Header from "../../components/Header/Header";
import MobileNav from "../../components/MobileNav/MobileNav";
import SideNav from "../../components/SideNav/SideNav";
import PracticeMain from "../../components/PracticeMain/PracticeMain";
import Footer from "../../components/Footer/Footer";
import homeIconBlue from "../../assets/icons/home-icon-blue-fa.svg";
import practiceIconBlue from "../../assets/icons/practice-icon-blue-fa.svg";
import progressIconBlue from "../../assets/icons/progress-icon-blue-fa.svg";
import choirIconBlue from "../../assets/icons/choir-icon-blue-fa.svg";
import messagesIconBlue from "../../assets/icons/messages-icon-blue-fa.svg";
import homeIconWhite from "../../assets/icons/home-icon-white-fa.svg";
import practiceIconWhite from "../../assets/icons/practice-icon-white-fa.svg";
import progressIconWhite from "../../assets/icons/progress-icon-white-fa.svg";
import choirIconWhite from "../../assets/icons/choir-icon-white-fa.svg";
import messagesIconWhite from "../../assets/icons/messages-icon-white-fa.svg";
import styles from "./Primary.module.scss";

class Primary extends Component {
    constructor(props) {
        super(props);
        this.generateTab("Home", homeIconBlue, homeIconWhite, false);
        this.generateTab("Practice", practiceIconBlue, practiceIconWhite, true);
        this.generateTab("Progress", progressIconBlue, progressIconWhite, false);
        this.generateTab("Choir", choirIconBlue, choirIconWhite, false);
        this.generateTab("Messages", messagesIconBlue, messagesIconWhite, false);
    }

    // Component state
    state = {
        isMobile: window.innerWidth < 768,
        showMobileNav: false
    };

    // Sidebar tabs
    mainNavTabs = [];

    /**
     * Returns an object containing data for the tab
     * @param {string} name - The tab name
     * @param {} mobileIcon - Icon to display on mobile devices
     * @param {} desktopIcon - Icon to display on desktop devices
     * @param {boolean} isCurrent - Whether or not the tab is the current tab
     * @returns The object for the tab
     */
    generateTab = (name, mobileIcon, desktopIcon, isCurrent) => {
        const tab = {
            key: shortid.generate(),
            name,
            mobileIcon,
            desktopIcon,
            isCurrent
        };
        this.mainNavTabs.push(tab);
    };

    componentDidMount() {
        // TODO: Uncomment for production
        // alert("The website is for authorized use only.");
        
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleWindowResize);
    }

    handleWindowResize = () => {
        this.setState({ isMobile: window.innerWidth < 768 });
    };

    handleShowHamburgerMenu = () => {
        this.setState(prevState => ({
            showMobileNav: !prevState.showMobileNav
        }));
    };

    render() {
        let mainNav = null;
        if (this.state.isMobile) {
            mainNav = <MobileNav tabs={this.mainNavTabs} show={this.state.showMobileNav} />;
        } else {
            mainNav = <SideNav tabs={this.mainNavTabs} />;
        }

        return (
            <div className={styles.primary}>
                <Header
                    hamburgerMenuClicked={this.handleShowHamburgerMenu}
                    isMobile={this.state.isMobile}
                />
                {mainNav}
                <PracticeMain />
                <Footer />
            </div>
        );
    }
}

export default Primary;
