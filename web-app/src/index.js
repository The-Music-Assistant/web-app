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

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {store} from "./store/reduxSetup";
import App from "./App/App";
import * as serviceWorker from "./serviceWorker";

// App container with React Router and Redux
const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

// Renders App
ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
