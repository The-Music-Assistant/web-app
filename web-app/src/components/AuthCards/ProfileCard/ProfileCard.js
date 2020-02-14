// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/ProfileCard/ProfileCard.js
// Description: Renders the profile card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

// NPM module imports
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "firebase/storage";

// Component imports
import TextInput from "../../FormInputs/TextInput/TextInput";
import ImageInput from "../../FormInputs/ImageInput/ImageInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";

// File imports
import { addUser } from "../../../App/musicAssistantApi";
import firebase from "../../../vendors/Firebase/firebase";
import closeIconRed from "../../../assets/icons/close-icon-red-fa.svg";
import * as alertBarTypes from "../../AlertBar/alertBarTypes";
import * as authStages from "../../../pages/Auth/authStages";
import * as textInputTypes from "../../FormInputs/TextInput/textInputTypes";

// Style imports
import profileCardStyles from "./ProfileCard.module.scss";
import authStyles from "../AuthCard.module.scss";

class ProfileCard extends Component {
    // Component state
    // formData holds form input values
    state = {
        formData: {
            profilePicture: null,
            firstName: "",
            lastName: ""
        }
    };

    /**
     * Updates form data state with new file input image
     * @param {object} event - The event (file input) that triggered this method
     */
    imageInputValueChangedHandler = event => {
        // Gets the profile picture if it exists
        const profilePicture = event.target.files.length === 1 ? event.target.files[0] : null;

        // Sets state with new input value
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData.profilePicture = profilePicture;
            return {
                formData: updatedFormData
            };
        });
    };

    /**
     * Shows an alert with the error details and removes the image from state
     */
    imageInputErrorHandler = () => {
        this.props.showAlert(
            alertBarTypes.ERROR,
            "Image Upload Error",
            "We couldn't load your profile picture. Please select a new one."
        );
        this.removeImageHandler();
    };

    /**
     * Removes the current image from state
     */
    removeImageHandler = () => {
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData.profilePicture = null;
            return {
                formData: updatedFormData
            };
        });
    };

    /**
     * Updates form data state with new text input value
     * @param {object} event - The event (text input) that triggered this method
     */
    textInputValueChangedHandler = event => {
        const inputName = event.target.name;
        const text = event.target.value;

        // Sets state with new input value
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData[inputName] = text;
            return {
                formData: updatedFormData
            };
        });
    };

    /**
     * Submits the profile form data
     * @param {object} - The event (button) that triggered this method
     */
    submitHandler = event => {
        // Prevents page reload
        event.preventDefault();

        // Gives redux the first name that was entered in the form
        // This first name is displayed on the welcome screen when sign up is done
        // this.props.firstNameEntered(this.state.formData.firstName);

        if (this.props.isAuthenticated) {
            // If the user is authenticated, upload the form data
            this.uploadData()
                .then(() => {
                    // Profile stage is done
                    this.props.setLoading(false);
                    this.props.done(authStages.PROFILE);
                })
                .catch(error => {
                    console.log("[ProfileCard/submitHandler]", error);
                    this.props.setLoading(false);
                    this.props.showAlert(alertBarTypes.ERROR, "Error", error.message);
                });
        } else {
            console.log("[ProfileCard/submitHandler]", "Not authenticated. Can't submit form");
        }
    };

    /**
     * Uploads the profile picture to Firebase storage
     * Sends the user's first name and last name to AWS server
     */
    uploadData = async () => {
        this.props.setLoading(true);
        try {
            // Uploads the profile picture if it exists (profile picture is not required)
            const profilePicture = this.state.formData.profilePicture;
            let profilePictureFileExtension = null;
            if (profilePicture) {
                profilePictureFileExtension = profilePicture.type.substring(6);
                const userUid = firebase.auth().currentUser.uid;
                await this.uploadProfilePicture(
                    userUid,
                    profilePicture,
                    profilePictureFileExtension
                );
            }

            // Modifies user data object to hold first name and last name
            const userData = { ...this.state.formData };
            delete userData.profilePicture;
            userData.profilePictureUrl = profilePictureFileExtension;

            // Sends the user data to the AWS server
            await addUser(userData);
        } catch (error) {
            console.log("[ProfileCard/uploadData]", error);

            // Throws a new error if the picture upload fails or the AWS upload fails
            const newError = new Error();
            newError.message = error.response.data;
            newError.status = error.response.status;
            throw newError;
        }
        this.props.setLoading(false);
    };

    /**
     * Uploads the profile picture in the form to Firebase storage
     * @param {string} userUid - The Firebase uid of the current user
     * @param {object} picture - The picture file to upload
     * @param {string} extension - The file extension to use (e.g. jpeg or png)
     */
    uploadProfilePicture = (userUid, picture, extension) => {
        const path = `users/${userUid}/profile_picture.${extension}`;
        return firebase
            .storage()
            .ref()
            .child(path)
            .put(picture);
    };

    /**
     * Renders the Profile Card component
     * The component consists of
     * A heading
     * A form consisting of an image upload, first name field, last name field, and submit button
     * The image upload includes a preview
     */
    render() {
        // If there is an image to show, display it in an image tag, along with a remove button
        // Otherwise, show a placeholder div
        const imageInput = this.state.formData.profilePicture ? (
            <div className={profileCardStyles.profileCardImageInput}>
                <div className={profileCardStyles.profileCardImageInputImgContainer}>
                    <img
                        src={URL.createObjectURL(this.state.formData.profilePicture)}
                        className={profileCardStyles.profileCardImageInputImg}
                        alt='Profile Picture'
                        onError={this.imageInputErrorHandler}
                    />
                    <button
                        className={profileCardStyles.profileCardImageInputRemoveButton}
                        type='button'
                        onClick={this.removeImageHandler}>
                        <img src={closeIconRed} alt={"Remove Profile Picture"} />
                    </button>
                </div>
                <ImageInput
                    inputName='profilePictureInput'
                    buttonName={"Select a profile picture"}
                    onChange={this.imageInputValueChangedHandler}
                    file={this.state.formData.profilePicture}
                    isRequired={false}
                />
            </div>
        ) : (
            <div className={profileCardStyles.profileCardImageInput}>
                <div className={profileCardStyles.profileCardImageInputImgPlaceholder}></div>
                <ImageInput
                    inputName='profilePictureInput'
                    buttonName={"Select a profile picture"}
                    onChange={this.imageInputValueChangedHandler}
                    isRequired={false}
                />
            </div>
        );

        // Returns the JSX to display
        return (
            <div className={authStyles.authCard}>
                <h3 className={authStyles.authCardHeading}>Your Profile</h3>
                <form className={authStyles.authCardForm} onSubmit={this.submitHandler}>
                    {imageInput}
                    <div className={profileCardStyles.profileCardTextInputs}>
                        <div className={profileCardStyles.profileCardTextInput}>
                            <TextInput
                                inputType={textInputTypes.TEXT}
                                inputName='firstName'
                                labelText='First Name'
                                value={this.state.formData.firstName}
                                isRequired={true}
                                onChange={this.textInputValueChangedHandler}
                            />
                        </div>
                        <div className={profileCardStyles.profileCardTextInput}>
                            <TextInput
                                inputType={textInputTypes.TEXT}
                                inputName='lastName'
                                labelText='Last Name'
                                value={this.state.formData.lastName}
                                isRequired={true}
                                onChange={this.textInputValueChangedHandler}
                            />
                        </div>
                    </div>
                    <div className={authStyles.authCardSubmitButtonContainer}>
                        <RectangularButton
                            type='submit'
                            value='submit'
                            text='Next'
                            backgroundColor='green'
                        />
                    </div>
                </form>
            </div>
        );
    }
}

/**
 * Gets the current state from Redux and passes it to ProfileCard as props
 * @param {object} state - The Redux state
 */
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

// Profile card prop types
ProfileCard.propTypes = {
    isAuthenticated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
    setLoading: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ProfileCard);
