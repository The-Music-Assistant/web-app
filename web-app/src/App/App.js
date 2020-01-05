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
import Startup from "../pages/Startup/Startup";
import Primary from "../pages/Primary/Primary";
import Auth from "../pages/Auth/Auth";
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

    render() {
        let page;

        if (this.state.minTimeElapsed) {
            if (this.props.isAuthenticated) {
                page = (
                    <div className='App'>
                        <Route path='/' component={Primary} />
                    </div>
                );
            } else {
                page = (
                    <div className='App'>
                        <Route path='/sign-up' component={Auth} />
                        <Redirect to='/sign-up' />
                    </div>
                );
            }
        } else {
            page = (
                <div className='App'>
                    <Route path='/startup' component={Startup} />
                    <Redirect to='/startup' />
                </div>
            );
        }

        return page;
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isLoadingAuth: state.auth.loading
    };
};

export default connect(mapStateToProps)(App);
