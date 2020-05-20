// NPM module imports
import { combineReducers } from "redux";

// File imports
import authReducer from "./auth";

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
    auth: authReducer,
});

export default rootReducer;
