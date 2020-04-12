/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/rootReducer.js
// Description:
    * Combines Redux reducers
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/1/2020
---------------------------------------------------------------------------- */

// NPM module imports
import { combineReducers } from "redux";

// File imports
import appReducer from "./app";
import authReducer from "./auth";
import startupReducer from "./startup";
import practiceReducer from "./practice";
import choirsReducer from "./choirs";

// Creates the root reducer by combining all reducers
const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    startup: startupReducer,
    practice: practiceReducer,
    choirs: choirsReducer,
});

export default rootReducer;
