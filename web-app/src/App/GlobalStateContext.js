// NPM module imports
import { createContext } from "react";

const GlobalStateContext = createContext({
    isAuthenticated: false,
    userFullName: "",
    userPictureUrl: "",
});

export default GlobalStateContext;
