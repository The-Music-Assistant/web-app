import React, { Component } from "react";
import shortid from "shortid";
import "normalize.css";
import "./App.scss";
import Header from "../Header/Header";
import MobileNav from "../MobileNav/MobileNav";
import homeIcon from "../assets/icons/home-icon-blue-fa.svg";
import practiceIcon from "../assets/icons/practice-icon-blue-fa.svg";
import progressIcon from "../assets/icons/progress-icon-blue-fa.svg";
import choirIcon from "../assets/icons/choir-icon-blue-fa.svg";
import messagesIcon from "../assets/icons/messages-icon-blue-fa.svg";

class App extends Component {
    state = {
        isMobile: window.innerWidth < 768,
        currentTab: "home",
        showMobileNav: false
    };

    mainNavTabs = [
        {
            key: shortid.generate(),
            name: "Home",
            icon: homeIcon,
            isCurrent: true
        },
        {
            key: shortid.generate(),
            name: "Practice",
            icon: practiceIcon,
            isCurrent: false
        },
        {
            key: shortid.generate(),
            name: "Progress",
            icon: progressIcon,
            isCurrent: false
        },
        {
            key: shortid.generate(),
            name: "Choir",
            icon: choirIcon,
            isCurrent: false
        },
        {
            key: shortid.generate(),
            name: "Messages",
            icon: messagesIcon,
            isCurrent: false
        }
    ];

    componentDidMount() {
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
        let mobileNav = null;
        if (this.state.isMobile) {
            mobileNav = (
                <MobileNav
                    isMobile={this.state.isMobile}
                    currentTab={this.state.currentTab}
                    tabs={this.mainNavTabs}
                    show={this.state.showMobileNav}
                />
            );
        }

        return (
            <div className='App'>
                <Header
                    hamburgerMenuClicked={this.handleShowHamburgerMenu}
                    isMobile={this.state.isMobile}
                />
                {mobileNav}
            </div>
        );
    }
}

export default App;
