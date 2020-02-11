/* ----------------------------------------------------------------------------
// File Path: src/store/reducers/rootReducer.js
// Description:
    * Combines Redux reducers
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/1/2020
---------------------------------------------------------------------------- */

import authReducer from "./auth";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    auth: authReducer
});

export default rootReducer;
