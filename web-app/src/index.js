// NPM module imports
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// File imports
import * as serviceWorker from "./serviceWorker";
import { store } from "./store/reduxSetup";

// Component imports
import App from "./App/App";

/**
 * The root JavaScript file for this app.
 * Sets up Redux.
 * Renders the app.
 * @file
 */

// The root component
const root = (
    <Provider store={store}>
        <App />
    </Provider>
);

// Renders the root component
ReactDOM.render(root, document.getElementById("root"));

serviceWorker.unregister();
