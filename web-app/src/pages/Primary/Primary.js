import React, { Component } from "react";
import shortid from "shortid";
import Header from "../../components/Header/Header";
import MobileNav from "../../components/MobileNav/MobileNav";
import SideNav from "../../components/SideNav/SideNav";
import PracticeMain from "../../pages/PracticeMain/PracticeMain";
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
import "./Primary.scss";

class Primary extends Component {
    state = {
        isMobile: window.innerWidth < 768,
        currentTab: "home",
        showMobileNav: false
    };

    mainNavTabs = [
        {
            key: shortid.generate(),
            name: "Home",
            mobileIcon: homeIconBlue,
            desktopIcon: homeIconWhite,
            isCurrent: false
        },
        {
            key: shortid.generate(),
            name: "Practice",
            mobileIcon: practiceIconBlue,
            desktopIcon: practiceIconWhite,
            isCurrent: true
        },
        {
            key: shortid.generate(),
            name: "Progress",
            mobileIcon: progressIconBlue,
            desktopIcon: progressIconWhite,
            isCurrent: false
        },
        {
            key: shortid.generate(),
            name: "Choir",
            mobileIcon: choirIconBlue,
            desktopIcon: choirIconWhite,
            isCurrent: false
        },
        {
            key: shortid.generate(),
            name: "Messages",
            mobileIcon: messagesIconBlue,
            desktopIcon: messagesIconWhite,
            isCurrent: false
        }
    ];

    componentDidMount() {
        // TODO: Uncomment for production
        alert("The website is for authorized use only.");

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
            mainNav = (
                <MobileNav
                    currentTab={this.state.currentTab}
                    tabs={this.mainNavTabs}
                    show={this.state.showMobileNav}
                />
            );
        } else {
            mainNav = <SideNav currentTab={this.state.currentTab} tabs={this.mainNavTabs} />;
        }

        return (
            <div id="Primary">
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
