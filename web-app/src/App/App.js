/* ----------------------------------------------------------------------------
// File Path: src/App/App.js
// Description:
    * Renders the App
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

import React, { Component } from "react";
import Primary from "../pages/Primary/Primary";
import "normalize.css";
import "./App.scss";

class App extends Component {
    render() {
        return (
            <div className='App'>
                <Primary />
            </div>
        );
    }
}

export default App;
