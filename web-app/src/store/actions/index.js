/**
 * All public Redux actions available from one file
 * @module reduxActionsIndex
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

export { setBrowserType } from "./app";

export {
    handleAuthStateChanges,
    getUserInfo,
    showWelcomePage,
    doNotShowWelcomePage,
    welcomePageComplete,
    startAuthFlow,
    signOut,
} from "./auth";

export { startupDone } from "./startup";

export {
    choirSelectedForPractice,
    musicSelectedForPractice,
    exerciseRequested,
    exerciseGenerated,
} from "./practice";

export { choirSelectedForChoirs } from "./choirs";
