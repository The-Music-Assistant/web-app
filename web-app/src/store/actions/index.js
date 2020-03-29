/* ----------------------------------------------------------------------------
// File Path: src/store/actions/index.js
// Description: Exports needed Redux actions
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 12/31/2019
---------------------------------------------------------------------------- */

export { setBrowserType } from "./app";

export {
    handleAuthStateChanges,
    getUserInfo,
    authFlowComplete,
    doNotShowWelcomePage,
    welcomePageComplete,
    startAuthFlow,
    signOut
} from "./auth";

export { startupDone } from "./startup";

export {
    choirSelectedForPractice,
    musicSelectedForPractice,
    exerciseRequested,
    exerciseGenerated
} from "./practice";

export { choirSelectedForChoirs } from "./choirs";
