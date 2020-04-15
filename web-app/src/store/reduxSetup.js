// NPM module imports
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// File imports
import rootReducer from "./reducers/rootReducer";
import { handleAuthStateChanges } from "./actions";

/**
 * Sets up Redux
 * @module reduxSetup
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * Gets the Redux developer tools extension if the app is running in dev mode.
 * Otherwise, gets the Redux compose variable
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * Creates the Redux store.
 * Uses redux-thunk middleware.
 */
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);

// Starts the Firebase auth state change listener
store.dispatch(handleAuthStateChanges());
