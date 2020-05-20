// NPM module imports
import React from "react";
import ReactDOM from "react-dom";

// File imports
import * as serviceWorker from "./serviceWorker";

// Component imports
import App from "./App/App";

/**
 * The root JavaScript file for this app.
 * Renders the app.
 * @file
 */

// Renders the root component
ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
