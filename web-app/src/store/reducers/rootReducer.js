// NPM module imports
import { combineReducers } from "redux";

// File imports
import appReducer from "./app";
import authReducer from "./auth";
import practiceReducer from "./practice";
import choirsReducer from "./choirs";

/**
 * Redux root reducer
 * @module reduxRootReducer
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

/**
 * The root Redux reducer.
 * The root reducer combines all reducers.
 */
const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    practice: practiceReducer,
    choirs: choirsReducer,
});

export default rootReducer;
