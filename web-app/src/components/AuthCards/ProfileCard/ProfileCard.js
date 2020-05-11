// NPM module imports
import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import "firebase/storage";

// Component imports
import LargeTextInput from "../../FormInputs/TextInputs/LargeTextInput/LargeTextInput";
import ImageInput from "../../FormInputs/ImageInput/ImageInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";

// File imports
import { addUser } from "../../../vendors/AWS/tmaApi";
import { getUserInfo, showWelcomePage } from "../../../store/actions/index";
import firebase from "../../../vendors/Firebase/firebase";
import { authError } from "../../../vendors/Firebase/logs";
import closeIconRed from "../../../assets/icons/close-icon-red.svg";
import * as alertBarTypes from "../../AlertBar/alertBarTypes";
import * as authStages from "../../../pages/Auth/authStages";
import * as textInputTypes from "../../FormInputs/TextInputs/textInputTypes";

// Style imports
import profileCardStyles from "./ProfileCard.module.scss";
import authCardStyles from "../AuthCard.module.scss";

/**
 * Renders the ProfileCard component.
 * Handles the user profile setup.
 * @component
 * @category AuthCards
 * @author Dan Levy <danlevy124@gmail.com>
 */
const ProfileCard = ({ setLoading, showAlert, done }) => {
    /**
     * A profile picture image file
     * {[profilePicture, setProfilePicture]: [object, function]}
     */
    const [profilePicture, setProfilePicture] = useState(null);

    /**
     * The first name input value
     * {[firstName, setFirstName]: [string, function]}
     */
    const [firstName, setFirstName] = useState("");

    /**
     * The last name input value
     * {[lastName, setLastName]: [string, function]}
     */
    const [lastName, setLastName] = useState("");

    /**
     * Indicates if a user is authenticated
     * @type {boolean}
     */
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    /**
     * react-redux dispatch function
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Updates state with new file input image
     * @param event - The event that called this function
     */
    const imageInputValueChangedHandler = (event) => {
        // Gets the profile picture if it exists
        const picture =
            event.target.files.length === 1 ? event.target.files[0] : null;

        console.log(picture);

        // Sets state with new image
        setProfilePicture(picture);
    };

    /**
     * Shows an alert and removes the image from state
     */
    const imageInputErrorHandler = () => {
        authError(
            null,
            "We couldn't load your profile picture. Please select a new one.",
            "[ProfileCard/imageInputErrorHandler]"
        );
        showAlert(
            alertBarTypes.ERROR,
            "Image Loading Error",
            "We couldn't load your profile picture. Please select a new one."
        );
        removeImageHandler();
    };

    /**
     * Removes the current image from state
     */
    const removeImageHandler = () => {
        setProfilePicture(null);
    };

    /**
     * Submits the profile form
     * @param {object} event - The event that called this function
     */
    const submitHandler = (event) => {
        // Prevents a page reload
        event.preventDefault();

        if (isAuthenticated) {
            // Uploads the form data
            uploadData()
                .then(() => {
                    // Profile stage is done
                    dispatch(showWelcomePage(true));
                    setLoading(false);
                    done(authStages.PROFILE);
                })
                .catch((error) => {
                    authError(
                        error.code,
                        error.message,
                        "[ProfileCard/submitHandler]"
                    );
                    setLoading(false);
                    showAlert(alertBarTypes.ERROR, "Error", error.message);
                });
        } else {
            authError(
                null,
                "Not authenticated. Can't submit form.",
                "[ProfileCard/submitHandler]"
            );
        }
    };

    /**
     * Uploads the profile picture to Firebase storage
     * Sends the user's first name and last name to the AWS server
     * @returns {promise} A promise that is waiting for the user data to upload
     */
    const uploadData = async () => {
        setLoading(true);

        try {
            // Uploads the profile picture if it exists (profile picture is not required)
            if (profilePicture) {
                await uploadProfilePicture();
            }

            // Creates a user data object that will be sent to the server
            const userData = {
                firstName,
                lastName,
                hasPicture: profilePicture ? true : false,
            };

            // Sends the user data to the AWS server
            await addUser(userData);

            // Gets the user data back from the server
            dispatch(getUserInfo());
        } catch (error) {
            // Throws a new error if the picture upload fails or the AWS upload fails
            const newError = new Error();
            if (error.code) {
                // Creates error if it's a Firebase error (Axios doesn't have an error.code, but Firebase does)
                newError.code = error.code;
                newError.message = error.message;
            } else {
                // Creates an error if it's a server error
                newError.code = error.response.status;
                newError.message = error.response.data;
            }
            throw newError;
        }
    };

    /**
     * Uploads the profile picture in the form to Firebase storage
     * @returns {promise} A promise that is waiting for the user's profile picture to upload
     */
    const uploadProfilePicture = () => {
        const userUid = firebase.auth().currentUser.uid;
        const path = `users/${userUid}/profile_picture`;
        return firebase.storage().ref().child(path).put(profilePicture);
    };

    /**
     * Gets the image input element
     * @returns The image input element (JSX)
     */
    const getImageInputElement = () => {
        return profilePicture ? (
            <Fragment>
                {/* Image container */}
                <section
                    className={
                        profileCardStyles.profileCardFormImageInputPreview
                    }
                >
                    {/* Image preview */}
                    <img
                        src={URL.createObjectURL(profilePicture)}
                        className={
                            profileCardStyles.profileCardFormImageInputPreviewImage
                        }
                        alt="User Avatar"
                        onError={imageInputErrorHandler}
                    />

                    {/* Remove image button */}
                    <button
                        className={
                            profileCardStyles.profileCardFormImageInputPreviewRemoveButton
                        }
                        type="button"
                        onClick={removeImageHandler}
                    >
                        <img
                            className={
                                profileCardStyles.profileCardFormImageInputPreviewRemoveButtonImage
                            }
                            src={closeIconRed}
                            alt={"Remove User Avatar"}
                        />
                    </button>
                </section>

                {/* Image file input button */}
                <ImageInput
                    inputName="profilePictureInput"
                    buttonTitle={"Select a profile picture"}
                    onChange={imageInputValueChangedHandler}
                    file={profilePicture}
                    isRequired={false}
                />
            </Fragment>
        ) : (
            <Fragment>
                {/* Image placeholder */}
                <div
                    className={
                        profileCardStyles.profileCardFormImageInputImagePlaceholder
                    }
                ></div>

                {/* Image file input button */}
                <ImageInput
                    inputName="profilePictureInput"
                    buttonTitle={"Select a profile picture"}
                    onChange={imageInputValueChangedHandler}
                    isRequired={false}
                />
            </Fragment>
        );
    };

    /**
     * Renders the ProfileCard component
     */
    // If there is an image to show, display it in an image tag, along with a remove button
    // Otherwise, show a placeholder div

    // Returns the JSX to display
    return (
        <section className={authCardStyles.authCard}>
            {/* Heading */}
            <h3 className={authCardStyles.authCardHeading}>Your Profile</h3>

            {/* Profile form */}
            <form
                className={authCardStyles.authCardForm}
                onSubmit={submitHandler}
            >
                {/* Profile image input */}
                <div className={profileCardStyles.profileCardFormImageInput}>
                    {getImageInputElement()}
                </div>

                {/* Text inputs */}
                <section
                    className={profileCardStyles.profileCardFormTextInputs}
                >
                    {/* First name input */}
                    <div className={profileCardStyles.profileCardFormTextInput}>
                        <LargeTextInput
                            inputType={textInputTypes.TEXT}
                            inputName="firstName"
                            labelText="First Name"
                            value={firstName}
                            isRequired={true}
                            onChange={(event) =>
                                setFirstName(event.target.value)
                            }
                        />
                    </div>

                    {/* Last name input */}
                    <div className={profileCardStyles.profileCardFormTextInput}>
                        <LargeTextInput
                            inputType={textInputTypes.TEXT}
                            inputName="lastName"
                            labelText="Last Name"
                            value={lastName}
                            isRequired={true}
                            onChange={(event) =>
                                setLastName(event.target.value)
                            }
                        />
                    </div>
                </section>

                {/* Submit button */}
                <div className={authCardStyles.authCardFormSubmitButton}>
                    <RectangularButton
                        type="submit"
                        value="submit"
                        title="Next"
                        backgroundColor="green"
                    />
                </div>
            </form>
        </section>
    );
};

// Prop types for the ProfileCard component
ProfileCard.propTypes = {
    /**
     * Tells Redux to show/hide the loading HUD (true for show and false for hide (i.e. remove))
     */
    setLoading: PropTypes.func.isRequired,

    /**
     * Tells Redux to show an alert
     */
    showAlert: PropTypes.func.isRequired,

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,
};

export default ProfileCard;
