// NPM module imports
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
import authStyles from "../AuthCard.module.scss";

/**
 * Renders the ProfileCard component.
 * Handles the user profile setup.
 * @extends {Component}
 * @author Dan Levy <danlevy124@gmail.com>
 * @component
 */
class ProfileCard extends Component {
    /**
     * ProfileCard component state
     * @property {object} formData - Form input values
     * @property {object} formData.profilePicture - A profile picture image file
     * @property {string} formData.firstName - The first name input value
     * @property {string} formData.lastName - The last name input value
     */
    state = {
        formData: {
            profilePicture: null,
            firstName: "",
            lastName: "",
        },
    };

    /**
     * Updates state with new file input image
     * @function
     * @param event - The event that called this function
     */
    imageInputValueChangedHandler = (event) => {
        // Gets the profile picture if it exists
        const profilePicture =
            event.target.files.length === 1 ? event.target.files[0] : null;

        // Sets state with new image
        this.setState((prevState) => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData.profilePicture = profilePicture;
            return {
                formData: updatedFormData,
            };
        });
    };

    /**
     * Shows an alert and removes the image from state
     * @function
     */
    imageInputErrorHandler = () => {
        authError(
            null,
            "We couldn't load your profile picture. Please select a new one.",
            "[ProfileCard/imageInputErrorHandler]"
        );
        this.props.showAlert(
            alertBarTypes.ERROR,
            "Image Loading Error",
            "We couldn't load your profile picture. Please select a new one."
        );
        this.removeImageHandler();
    };

    /**
     * Removes the current image from state
     * @function
     */
    removeImageHandler = () => {
        this.setState((prevState) => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData.profilePicture = null;
            return {
                formData: updatedFormData,
            };
        });
    };

    /**
     * Updates state with new text input value
     * @function
     * @param event - The event that called this function
     */
    textInputValueChangedHandler = (event) => {
        const inputName = event.target.name;
        const text = event.target.value;

        // Sets state with new input value
        this.setState((prevState) => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData[inputName] = text;
            return {
                formData: updatedFormData,
            };
        });
    };

    /**
     * Submits the profile form
     * @function
     * @param {object} event - The event that called this function
     */
    submitHandler = (event) => {
        // Prevents a page reload
        event.preventDefault();

        if (this.props.isAuthenticated) {
            // Uploads the form data
            this.uploadData()
                .then(() => {
                    // Profile stage is done
                    this.props.showWelcomePage(true);
                    this.props.setLoading(false);
                    this.props.done(authStages.PROFILE);
                })
                .catch((error) => {
                    authError(
                        error.code,
                        error.message,
                        "[ProfileCard/submitHandler]"
                    );
                    this.props.setLoading(false);
                    this.props.showAlert(
                        alertBarTypes.ERROR,
                        "Error",
                        error.message
                    );
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
     * @function
     * @returns {promise} A promise that is waiting for the user data to upload
     */
    uploadData = async () => {
        this.props.setLoading(true);

        try {
            // Uploads the profile picture if it exists (profile picture is not required)
            const profilePicture = this.state.formData.profilePicture;
            if (profilePicture) {
                await this.uploadProfilePicture();
            }

            // Creates a user data object that will be sent to the server
            const userData = { ...this.state.formData };
            if (userData.profilePicture) {
                userData.hasPicture = true;
            } else {
                userData.hasPicture = false;
            }
            delete userData.profilePicture;

            // Sends the user data to the AWS server
            await addUser(userData);

            // Gets the user data back from the server
            this.props.updateUserInfo();
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
     * @function
     * @returns {promise} A promise that is waiting for the user's profile picture to upload
     */
    uploadProfilePicture = () => {
        const userUid = firebase.auth().currentUser.uid;
        const path = `users/${userUid}/profile_picture`;
        return firebase
            .storage()
            .ref()
            .child(path)
            .put(this.state.formData.profilePicture);
    };

    /**
     * Gets the image input element
     * @function
     * @returns The image input element (JSX)
     */
    getImageInputElement = () => {
        return this.state.formData.profilePicture ? (
            <Fragment>
                {/* Image container */}
                <div
                    className={
                        profileCardStyles.profileCardImageInputImgContainer
                    }
                >
                    {/* Image preview */}
                    <img
                        src={URL.createObjectURL(
                            this.state.formData.profilePicture
                        )}
                        className={profileCardStyles.profileCardImageInputImg}
                        alt="User Avatar"
                        onError={this.imageInputErrorHandler}
                    />

                    {/* Remove image button */}
                    <button
                        className={
                            profileCardStyles.profileCardImageInputRemoveButton
                        }
                        type="button"
                        onClick={this.removeImageHandler}
                    >
                        <img
                            className={
                                profileCardStyles.profileCardImageInputRemoveButtonImg
                            }
                            src={closeIconRed}
                            alt={"Remove User Avatar"}
                        />
                    </button>
                </div>

                {/* Image file input */}
                <ImageInput
                    inputName="profilePictureInput"
                    buttonTitle={"Select a profile picture"}
                    onChange={this.imageInputValueChangedHandler}
                    file={this.state.formData.profilePicture}
                    isRequired={false}
                />
            </Fragment>
        ) : (
            <Fragment>
                {/* Image placeholder */}
                <div
                    className={
                        profileCardStyles.profileCardImageInputImgPlaceholder
                    }
                ></div>

                {/* Image file input */}
                <ImageInput
                    inputName="profilePictureInput"
                    buttonTitle={"Select a profile picture"}
                    onChange={this.imageInputValueChangedHandler}
                    isRequired={false}
                />
            </Fragment>
        );
    };

    /**
     * Renders the ProfileCard component
     */
    render() {
        // If there is an image to show, display it in an image tag, along with a remove button
        // Otherwise, show a placeholder div

        // Returns the JSX to display
        return (
            <div className={authStyles.authCard}>
                {/* Heading */}
                <h3 className={authStyles.authCardHeading}>Your Profile</h3>

                {/* Profile form */}
                <form
                    className={authStyles.authCardForm}
                    onSubmit={this.submitHandler}
                >
                    {/* Profile image input */}
                    <div className={profileCardStyles.profileCardImageInput}>
                        {this.getImageInputElement()}
                    </div>

                    {/* Text inputs */}
                    <div className={profileCardStyles.profileCardTextInputs}>
                        {/* First name input */}
                        <div className={profileCardStyles.profileCardTextInput}>
                            <LargeTextInput
                                inputType={textInputTypes.TEXT}
                                inputName="firstName"
                                labelText="First Name"
                                value={this.state.formData.firstName}
                                isRequired={true}
                                onChange={this.textInputValueChangedHandler}
                            />
                        </div>

                        {/* Last name input */}
                        <div className={profileCardStyles.profileCardTextInput}>
                            <LargeTextInput
                                inputType={textInputTypes.TEXT}
                                inputName="lastName"
                                labelText="Last Name"
                                value={this.state.formData.lastName}
                                isRequired={true}
                                onChange={this.textInputValueChangedHandler}
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className={authStyles.authCardSubmitButtonContainer}>
                        <RectangularButton
                            type="submit"
                            value="submit"
                            text="Next"
                            backgroundColor="green"
                        />
                    </div>
                </form>
            </div>
        );
    }
}

// Prop types for the ProfileCard component
ProfileCard.propTypes = {
    /**
     * Indicates if a user is authenticated
     */
    isAuthenticated: PropTypes.bool.isRequired,

    /**
     * Tells Redux to show/hide the loading HUD (true for show and false for hide (i.e. remove))
     */
    setLoading: PropTypes.func.isRequired,

    /**
     * Tells Redux to show an alert
     */
    showAlert: PropTypes.func.isRequired,

    /**
     * Tells Redux to get updated user data from the server
     */
    updateUserInfo: PropTypes.func.isRequired,

    /**
     * Tells Redux to show the welcome page
     */
    showWelcomePage: PropTypes.func.isRequired,

    /**
     * Tells Redux that this component is no longer needed (i.e. done)
     */
    done: PropTypes.func.isRequired,
};

/**
 * Gets the current state from Redux and passes parts of it to the ProfileCard component as props.
 * This function is used only by the react-redux connect function.
 * @memberof ProfileCard
 * @param {object} state - The Redux state
 * @returns {object} Redux state properties used in the ProfileCard component
 */
const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

/**
 * Passes certain Redux actions to the ProfileCard component as props.
 * This function is used only by the react-redux connect function.
 * @memberof ProfileCard
 * @param {function} dispatch - The react-redux dispatch function
 * @returns {object} Redux actions used in the ProfileCard component
 */
const mapDispatchToProps = (dispatch) => {
    return {
        updateUserInfo: () => dispatch(getUserInfo()),
        showWelcomePage: (isAuthFlowComplete) =>
            dispatch(showWelcomePage(isAuthFlowComplete)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);
