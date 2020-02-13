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
import {startAuthFlow} from "../store/actions";
import Startup from "../pages/Startup/Startup";
import Auth from "../pages/Auth/Auth";
import Welcome from "../pages/Welcome/Welcome";
import Primary from "../pages/Primary/Primary";
import * as authStages from "../pages/Auth/authStages";
import "normalize.css";
import "./App.scss";

class App extends Component {
    state = {
        startupMinTimeElapsed: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({ startupMinTimeElapsed: true });
        }, 2000);
    }

    render() {
        let page;

        if (this.props.isAuthenticated === null || !this.state.startupMinTimeElapsed) {
            page = (
                <div className='App'>
                    <Route path='/startup'>
                        <Startup />
                    </Route>
                    <Redirect to='/startup' />
                </div>
            );
        } else if (!this.props.isAuthenticated || !this.props.authFlowComplete) {
            page = (
                <div className='App'>
                    <Route path='/auth'>
                        <Auth />
                    </Route>
                    <Redirect to='/auth' />
                </div>
            );
        } else if (this.props.showWelcomePage) {
            page = (
                <div className='App'>
                    <Route path='/welcome'>
                        <Welcome />
                    </Route>
                    <Redirect to='/welcome' />
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
        authFlowComplete: state.auth.authFlowComplete,
        showWelcomePage: state.auth.showWelcomePage
    };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         startAuthFlow: () => dispatch(startAuthFlow())
//     };
// };

export default connect(mapStateToProps)(App);
