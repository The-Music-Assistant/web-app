// NPM module imports
import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    Fragment,
} from "react";
import { useDispatch } from "react-redux";
import { MetroSpinner } from "react-spinners-kit";

// File imports
import { signOut, welcomePageComplete } from "../../store/actions/index";
import * as alertBarTypes from "../../components/AlertBar/alertBarTypes";
import firebase from "../../vendors/Firebase/firebase";
import { authError } from "../../vendors/Firebase/logs";

// Image imports
import logo from "../../assets/logos/tma-logo-white.png";
import downArrow from "../../assets/icons/down-arrow-white.svg";

// Component  imports
import RectangularButton from "../../components/Buttons/RectangularButton/RectangularButton";
import AlertBar from "../../components/AlertBar/AlertBar";

// Style imports
import styles from "./Welcome.module.scss";

/**
 * Renders the Welcome component.
 * This component displays when a user needs to confirm their email.
 * @component
 * @category Welcome
 * @author Dan Levy <danlevy124@gmail.com>
 */
const Welcome = () => {
    /**
     * Indicates if the component is in a loading state
     * {[isLoading, setIsLoading]: [boolean, function]}
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Indicates if the user's email is verified
     * {[isUserEmailVerified, setIsUserEmailVerified]: [boolean, function]}
     */
    const [isUserEmailVerified, setIsUserEmailVerified] = useState(false);

    /**
     * Data used to display an alert
     * {[alertData, setAlertData]: [object, function]}
     * {module:alertBarTypes} alertData.type - The type of alert bar to show
     * {string} alertData.heading - The alert heading
     * {string} alertData.message - The alert message
     */
    const [alertData, setAlertData] = useState(null);

    /**
     * react-redux dispatch function
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Indicates if the user's email was checked for verification at least once
     * @type {boolean}
     */
    const wasEmailVerificationCheckedAlready = useRef(false);

    /**
     * Checks if the user's email is verified.
     * Updates state depending on result.
     */
    const checkIfUserEmailIsVerified = useCallback(() => {
        // Sets loading to true in state
        setIsLoading(true);

        // Reloads the user and checks if the user's email is verified
        const currentUser = firebase.auth().currentUser;
        currentUser
            .reload()
            .then(() => {
                if (currentUser.emailVerified) {
                    userEmailIsVerified();
                } else {
                    userEmailNotVerified();
                }
                wasEmailVerificationCheckedAlready.current = true;
            })
            .catch(userEmailFetchError);
    }, []);

    /**
     * Checks if the user's email is verified
     */
    useEffect(() => {
        checkIfUserEmailIsVerified();
    }, [checkIfUserEmailIsVerified]);

    /**
     * Updates state to indicate that the email is verified
     */
    const userEmailIsVerified = () => {
        setIsLoading(false);
        setIsUserEmailVerified(true);
    };

    /**
     * Updates state to indicate that the email is not verified
     * Alerts the user that the email is not verified
     */
    const userEmailNotVerified = () => {
        // Updates state
        setIsLoading(false);
        setIsUserEmailVerified(false);

        // Alerts the user only if this is not the first check
        if (wasEmailVerificationCheckedAlready.current) {
            setAlertData({
                type: alertBarTypes.WARNING,
                heading: "Not Verified",
                message: `Your email is not verified. If you can't find the verification email, please click "Resend Email."`,
            });
        }
    };

    /**
     * Updates the state to indicate that the email is not verified.
     * Alerts the user that there was an error.
     * @param {object} error - The error received
     */
    const userEmailFetchError = (error) => {
        authError(error.code, error.message, "[Welcome/userEmailFetchError]");

        setIsLoading(false);
        setAlertData({
            type: alertBarTypes.ERROR,
            heading: "Error",
            message: error.message,
        });
    };

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    const doneButtonClickedHandler = () => {
        dispatch(welcomePageComplete());
    };

    /**
     * Resends an email verification
     */
    const resendEmailVerificationButtonClickedHandler = () => {
        // Sets loading to true in state
        setIsLoading(true);

        // Sends an email verification
        firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(emailWasSentHandler)
            .catch(userEmailFetchError);
    };

    /**
     * Updates state to indicate that a verification email was sent.
     * Alerts the user that a verification email was sent.
     */
    const emailWasSentHandler = () => {
        setIsLoading(false);
        setAlertData({
            type: alertBarTypes.INFO,
            heading: "Email Sent",
            message: "We have sent a new verification email",
        });
    };

    /**
     * Creates an alert bar if one was requested
     * @returns {object} An alert bar (JSX)
     */
    const getAlertBar = () => {
        return alertData ? (
            <AlertBar
                type={alertData.type}
                heading={alertData.heading}
                message={alertData.message}
                done={() => setAlertData(null)}
            />
        ) : null;
    };

    /**
     * Gets the main component (loading spinner, success, or check email)
     * @returns {object} The main component (JSX)
     */
    const getMainComponent = () => {
        if (isLoading) {
            return getSpinner();
        } else if (isUserEmailVerified) {
            return getSuccessComponent();
        } else {
            return getCheckEmailComponent();
        }
    };

    /**
     * Creates a spinner
     * @returns {object} A spinner (JSX)
     */
    const getSpinner = () => {
        return (
            <div className={styles.welcomeMainSpinner}>
                <MetroSpinner size={75} color="#F8F8F8" loading={true} />
            </div>
        );
    };

    /**
     * Creates the success component
     * @returns {object} A success component (JSX)
     */
    const getSuccessComponent = () => {
        return (
            <Fragment>
                {/* Heading */}
                <p className={styles.welcomeMainMessage}>
                    Your account has been created and a new experience awaits!
                    Click "Let's Go!" to add your first choir.
                </p>

                {/* Down arrow */}
                <img
                    className={styles.welcomeMainDownArrow}
                    src={downArrow}
                    alt="Down Arrow"
                />

                {/* Done Button */}
                <div className={styles.welcomeMainButton}>
                    <RectangularButton
                        backgroundColor="orange"
                        type="button"
                        value=""
                        title="Let's Go!"
                        onClick={doneButtonClickedHandler}
                    />
                </div>
            </Fragment>
        );
    };

    /**
     * Creates a check email component
     * @returns {object} A check email component (JSX)
     */
    const getCheckEmailComponent = () => {
        return (
            <Fragment>
                {/* Heading */}
                <p className={styles.welcomeMainMessage}>
                    {`Please check your email (${
                        firebase.auth().currentUser.email
                    }) for a message from "The Music Assistant." Click the link to verify your email address and then come back here!`}
                </p>

                {/* Down arrow */}
                <img
                    className={styles.welcomeMainDownArrow}
                    src={downArrow}
                    alt="Down Arrow"
                />

                {/* Options */}
                <section className={styles.welcomeMainButtons}>
                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor="orange"
                            type="button"
                            value=""
                            title="I Verified My Email"
                            onClick={() => checkIfUserEmailIsVerified()}
                        />
                    </div>

                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor="blue"
                            type="button"
                            value=""
                            title="Resend Email"
                            onClick={
                                resendEmailVerificationButtonClickedHandler
                            }
                        />
                    </div>

                    <div className={styles.welcomeMainButton}>
                        <RectangularButton
                            backgroundColor="red"
                            type="button"
                            value=""
                            title="Sign Out"
                            onClick={() => {
                                dispatch(signOut());
                            }}
                        />
                    </div>
                </section>
            </Fragment>
        );
    };

    /**
     * Renders the Welcome component
     */
    return (
        <div className={styles.welcome}>
            {getAlertBar()}

            {/* Page header */}
            <header className={styles.welcomeHeader}>
                <img
                    className={styles.welcomeHeaderLogo}
                    src={logo}
                    alt="Music Assistant Logo"
                />
                <h1 className={styles.welcomeHeaderMessage}>
                    Welcome to <br /> The Music Assistant
                </h1>
            </header>

            <main className={styles.welcomeMain}>{getMainComponent()}</main>
        </div>
    );
};

export default Welcome;
