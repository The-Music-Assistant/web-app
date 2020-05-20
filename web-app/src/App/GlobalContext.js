// NPM module imports
import { createContext } from "react";

/**
 * Global context
 * @module
 * @category App
 * @author Dan Levy <danlevy124@gmail.com>
 */
const GlobalContext = createContext({
    isAuthenticated: false,
    userFullName: "",
    userPictureUrl: "",
    showAlert: () => {},
});

export default GlobalContext;
