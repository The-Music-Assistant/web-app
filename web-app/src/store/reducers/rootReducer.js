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
import authReducer from "./auth";

// Creates the root reducer by combining all reducers
const rootReducer = combineReducers({
    auth: authReducer
});

export default rootReducer;
