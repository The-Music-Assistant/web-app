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
import firebase from "../vendors/Firebase/firebase";
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

    componentDidUpdate() {
        if (this.props.isAuthenticated && !this.state.authStage) {
            this.setState({ authStage: authStages.SIGN_IN });
        }
    }

    welcomePageDoneHandler = () => {
        this.render();
    };

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

        // TODO: isAuthenticated gets changed in Redux and Auth is no longer shown. I need to keep Auth shown until sign up flow is complete
        } else if (!this.props.isAuthenticated) {
            page = (
                <div className='App'>
                    <Route path="/auth">
                        <Auth />
                    </Route>
                    <Redirect to="/auth" />
                </div>
            );
        } else if (!firebase.auth().currentUser.emailVerified) {
            page = (
                <div className='App'>
                    <Route path='/welcome'>
                        <Welcome
                            // firstName={this.props.firstName}
                            done={this.welcomePageDoneHandler}
                        />
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
        isAuthenticated: state.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(App);
