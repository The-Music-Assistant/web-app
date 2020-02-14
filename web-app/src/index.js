/* ----------------------------------------------------------------------------
// File Path: src/index.js
// Description:
    * Sets up Redux
    * Sets up React Router
    * Tries to get an authenticated user
    * Renders App
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

// NPM module imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// File imports
import * as serviceWorker from "./serviceWorker";
import {store} from "./store/reduxSetup";

// Component imports
import App from "./App/App";

// App container with React Router and Redux
const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

// Renders the App component
ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
