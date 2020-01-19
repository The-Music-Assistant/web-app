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

        if (this.props.isFinishedLoading && this.state.minTimeElapsed) {
            if (!this.props.isSigningUp && this.props.isAuthenticated) {
                page = (
                    <div className='App'>
                        <Route path='/'>
                            <Primary />
                        </Route>
                        <Redirect to='/' />
                    </div>
                );
            } else {
                page = (
                    <div className='App'>
                        <Route path='/sign-up'>
                            <Auth />
                        </Route>
                        <Redirect to='/sign-up' />
                    </div>
                );
            }
        } else {
            page = (
                <div className='App'>
                    <Route path='/startup'>
                        <Startup />
                    </Route>
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
        isFinishedLoading: !state.startup.isStartingUp,
        isSigningUp: state.auth.isSigningUp
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         startupAuthFinished: () => dispatch(startupAuthFinished())
//     };
// };

export default connect(mapStateToProps)(App);
