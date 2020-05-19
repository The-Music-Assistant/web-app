/**
 * All public Redux actions available from one file
 * @module reduxActionsIndex
 * @category Redux
 * @author Dan Levy <danlevy124@gmail.com>
 */

export { setBrowserType } from "./app";

export {
    getUserInfo,
    showWelcomePage,
    doNotShowWelcomePage,
    welcomePageComplete,
    startAuthFlow,
    signOut,
    retrievedUsersName,
    retrievedUsersPictureUrl,
    userAuthenticated,
} from "./auth";

export {
    choirSelectedForPractice,
    musicSelectedForPractice,
    exerciseRequested,
    exerciseGenerated,
} from "./practice";

export { choirSelectedForChoirs } from "./choirs";
