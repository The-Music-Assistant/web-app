// NPM module imports
import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useContext,
} from "react";
import PropTypes from "prop-types";
import shortid from "shortid";

// Component imports
import ChoirCard from "./ChoirCards/ChoirCard/ChoirCard";
import ChoirOptionCard from "./ChoirCards/ChoirOptionCard/ChoirOptionCard";
import PageHeader from "../PageHeader/PageHeader";
import LoadingContainer from "../Spinners/LoadingContainer/LoadingContainer";

// Context imports
import GlobalContext from "../../App/GlobalContext";

// Image imports
import plusIcon from "../../assets/icons/plus-icon.svg";
import questionIcon from "../../assets/icons/question-icon.svg";

// File imports
import { choirSelectionError } from "../../vendors/Firebase/logs";
import { getUsersChoirs, joinChoir } from "../../vendors/AWS/tmaApi";
import * as alertBarTypes from "../AlertBar/alertBarTypes";
import * as cardColorOptions from "./ChoirCards/choirCardColorOptions";

// Style imports
import styles from "./ChoirSelection.module.scss";

/**
 * Renders the choir selection component
 * Shows a card for each choir, as well as card(s) for choir option(s).
 * @component
 * @category ChoirSelection
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ChoirSelection = ({ onChoirClick }) => {
    /**
     * Indicates if the component is in a loading state
     * {[isLoading, setIsLoading]: [boolean, function]}
     */
    const [isLoading, setIsLoading] = useState(true);

    /**
     * An array of choirs that the user is a member of
     * {[choirs, setChoirs]: [array, function]}
     */
    const [choirs, setChoirs] = useState([]);

    /**
     * Global context
     * @type {object}
     * @property {function} showAlert - Shows an alert
     */
    const { showAlert } = useContext(GlobalContext);

    /**
     * Indicates if the component is mounted.
     * Used for asynchronous tasks.
     * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
     */
    const isMounted = useRef(false);

    /**
     * Gets the list of choirs that the user is a member of
     */
    const getChoirList = useCallback(() => {
        // Gets the choir list
        getUsersChoirs()
            .then((snapshot) => {
                // Updates state
                if (isMounted.current) {
                    setChoirs(snapshot.data.choirs);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                // Logs an error
                choirSelectionError(
                    error.response.status,
                    error.response.data,
                    "[ChoirSelection/getChoirList]"
                );

                // Shows an alert
                showAlert(alertBarTypes.ERROR, "Error", error.response.data);

                // Updates state
                if (isMounted.current) {
                    setIsLoading(false);
                }
            });
    }, [showAlert]);

    /**
     * Sets isMounted to true.
     * Gets the list of choirs.
     * @returns A cleanup function that sets isMounted to false
     */
    useEffect(() => {
        isMounted.current = true;

        getChoirList();

        return () => {
            isMounted.current = false;
        };
    }, [getChoirList]);
    /**
     * Attempts to join a new choir
     */
    const newChoirClickHandler = () => {
        // Asks the user to enter an access code
        const accessCode = prompt("Please enter the access code given to you");

        if (accessCode) {
            // Adds user to the list of pending members for the choir
            // An admin for the choir must verfiy this user before this user can access the choir
            joinChoir({ memberType: "student", memberRole: "x", accessCode })
                .then(() => {
                    // Show a success alert
                    showAlert(
                        alertBarTypes.SUCCESS,
                        "Hang Tight",
                        "Your request to join the choir has been sent. Please wait for a choir administrator to confirm your request."
                    );
                })
                .catch((error) => {
                    // Logs the error
                    choirSelectionError(
                        error.response.status,
                        error.response.data,
                        "[ChoirSelection/newChoirClickHandler]"
                    );

                    // Shows an alert
                    showAlert(
                        alertBarTypes.ERROR,
                        "Error",
                        error.response.data
                    );
                });
        }
    };

    // TODO: Add this functionality
    const viewPendingRequestsClickHandler = () => {};

    /**
     * Creates a ChoirCard component for each choir.
     * Also creates a ChoirOptionCard for each choir option.
     * @returns - An array of choir card components
     */
    const getChoirComponents = () => {
        const cards = getChoirCards();

        // Adds a card for adding a new choir
        cards.push(
            <ChoirOptionCard
                key={shortid.generate()}
                iconSrc={plusIcon}
                name="New Choir"
                cardColor={cardColorOptions.ORANGE}
                onClick={newChoirClickHandler}
            />
        );

        // Adds a card for viewing pending choir requests
        cards.push(
            <ChoirOptionCard
                key={shortid.generate()}
                iconSrc={questionIcon}
                name="View Pending Choir Requests"
                cardColor={cardColorOptions.TERTIARY_BLUE}
                onClick={viewPendingRequestsClickHandler}
            />
        );

        // Returns the array of choir cards
        return cards;
    };

    /**
     * Gets an array of ChoirCard components
     * @returns {array} An array of ChoirCard components
     */
    const getChoirCards = () => {
        // An array of color options
        const colorOptions = Object.values(cardColorOptions);

        // Index starts at -1 because it is incremented before its first use
        let colorIndex = -1;

        // Maps the choirs to cards
        return choirs.map((choir) => {
            // Gets the next color
            colorIndex++;

            // >= is tested instead of > because colorIndex is incremented before this check
            if (colorIndex >= colorOptions.length) {
                // Start back at the beginning of the colorOptions array
                colorIndex = 0;
            }

            // Returns a ChoirCard to the map function
            return (
                <ChoirCard
                    key={shortid.generate()}
                    headerImageSrc={choir.picture_url}
                    name={choir.choir_name}
                    description={choir.description}
                    cardColor={colorOptions[colorIndex]}
                    onClick={() =>
                        onChoirClick(choir.choir_id, choir.choir_name)
                    }
                />
            );
        });
    };

    /**
     * Gets the main component to display (loading or choir cards)
     * @returns JSX
     */
    const getComponent = () => {
        if (isLoading) {
            // Display a loading spinner
            return <LoadingContainer message="Loading choirs..." />;
        } else {
            // Display the choir cards
            return (
                <div className={styles.choirSelectionCards}>
                    {getChoirComponents()}
                </div>
            );
        }
    };

    // Renders the ChoirSelection component
    return (
        <main className={styles.choirSelection}>
            <PageHeader
                heading="Choir Selection"
                shouldDisplayBackButton={false}
            />

            {getComponent()}
        </main>
    );
};

// Prop types for the ChoirSelection component
ChoirSelection.propTypes = {
    /**
     * Click handler for a choir
     */
    onChoirClick: PropTypes.func.isRequired,
};

export default ChoirSelection;
