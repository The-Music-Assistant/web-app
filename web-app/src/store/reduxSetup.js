/* ----------------------------------------------------------------------------
// File Path: src/index.js
// Description: Sets up Redux
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/7/2020
---------------------------------------------------------------------------- */

// NPM module imports
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// File imports
import rootReducer from "./reducers/rootReducer";
import { handleAuthStateChanges } from "./actions";

// Redux setup
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

// Starts Firebase auth state change listener
store.dispatch(handleAuthStateChanges());
