/* ----------------------------------------------------------------------------
// File Path: src/App/App.js
// Description:
    * Renders the App
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import startupAuthFinished from "../store/actions";
import Startup from "../pages/Startup/Startup";
import Auth from "../pages/Auth/Auth";
import Welcome from "../pages/Welcome/Welcome";
import Primary from "../pages/Primary/Primary";
import * as authFlows from "../pages/Auth/authFlows";
import { startSignIn } from "../store/actions";
import "normalize.css";
import "./App.scss";

class App extends Component {
    state = {
        minTimeElapsed: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({ minTimeElapsed: true });
        }, 2000);
    }

    componentDidUpdate() {
        if (this.props.startupLoadingDone && this.state.minTimeElapsed && !this.props.authFlow) {
            if (!this.props.isAuthenticated) {
                this.props.startSignIn();
            }
        }
    }

    render() {
        let page;

        if (!this.props.startupLoadingDone || !this.state.minTimeElapsed) {
            page = (
                <div className='App'>
                    <Route path='/startup'>
                        <Startup />
                    </Route>
                    <Redirect to='/startup' />
                </div>
            );
        } else if (this.props.authFlow === authFlows.SIGN_IN) {
            page = (
                <div className='App'>
                    <Route path='/sign-in'>
                        <Auth />
                    </Route>
                    <Redirect to='/sign-in' />
                </div>
            );
        } else if (this.props.authFlow === authFlows.SIGN_UP) {
            page = (
                <div className='App'>
                    <Route path='/sign-up'>
                        <Auth />
                    </Route>
                    <Redirect to='/sign-up' />
                </div>
            );
        } else if (this.props.showWelcomePage) {
            page = (
                <div className='App'>
                    <Route path='/sign-up'>
                        <Welcome firstName={this.props.firstName} />
                    </Route>
                    <Redirect to='/sign-up' />
                </div>
            );
        } else {
            page = (
                <div className='App'>
                    <Route path='/'>
                        <Primary />
                    </Route>
                    <Redirect to='/' />
                </div>
            );
        }

        return page;
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        startupLoadingDone: !state.startup.isStartingUp,
        showWelcomePage: state.auth.showWelcomePage,
        firstName: state.auth.firstName,
        authFlow: state.auth.authFlow
    };
};

const mapDispatchToProps = dispatch => {
    return {
        startSignIn: () => dispatch(startSignIn())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
