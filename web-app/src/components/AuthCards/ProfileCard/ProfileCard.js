// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/ProfileCard/ProfileCard.js
// Description: Renders the profile card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import firebase from "../../../vendors/Firebase/firebase";
import "firebase/storage";
import TextInput from "../../FormInputs/TextInput/TextInput";
import ImageInput from "../../FormInputs/ImageInput/ImageInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import closeIconRed from "../../../assets/icons/close-icon-red-fa.svg";
import profileCardStyles from "./ProfileCard.module.scss";
import authStyles from "../AuthCard.module.scss";
import { addPerson } from "../../../App/musicAssistantApi";

class ProfileCard extends Component {
    state = {
        formData: {
            profilePicture: null,
            firstName: "",
            lastName: ""
        }
    };

    imageInputValueChangedHandler = event => {
        const profilePicture = event.target.files.length === 1 ? event.target.files[0] : null;
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData.profilePicture = profilePicture;
            return {
                formData: updatedFormData
            };
        });
    };

    textInputValueChangedHandler = event => {
        const inputName = event.target.name;
        const text = event.target.value;
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData[inputName] = text;
            return {
                formData: updatedFormData
            };
        });
    };

    imageInputErrorHandler = () => {
        this.props.showAlert(
            "error",
            "Image Upload Error",
            "We couldn't load your profile picture. Please select a new one."
        );
        this.removeImageHandler();
    };

    removeImageHandler = event => {
        this.setState(prevState => {
            const updatedFormData = { ...prevState.formData };
            updatedFormData.profilePicture = null;
            return {
                formData: updatedFormData
            };
        });
    };

    submitHandler = event => {
        event.preventDefault();
        if (this.props.isAuthenticated) {
            this.uploadData()
                .then(() => {
                    this.props.setLoading(false);
                    this.props.showAlert("success", "Success!", "Your account has been created");
                })
                .catch(error => {
                    this.props.setLoading(false);
                    this.props.showAlert("error", "Error", error.message);
                });
        } else {
            console.log("Not authenticated");
        }
    };

    uploadData = async () => {
        this.props.setLoading(true);
        try {
            let profilePictureURL = await this.uploadProfilePicture();
            profilePictureURL = profilePictureURL.replace("profile_picture", "profile_picture_200x200");
            await addPerson(
                this.state.formData.firstName,
                this.state.formData.lastName,
                profilePictureURL
            );
        } catch (error) {
            console.log(error);
            const newError = new Error();
            newError.message = error.response.data;
            newError.status = error.response.status;
            throw newError;
        }
        this.props.setLoading(false);
    };

    uploadProfilePicture = () => {
        const profilePicture = this.state.formData.profilePicture;
        if (profilePicture) {
            const userUid = firebase.auth().currentUser.uid;
            const profilePictureFileExtension = profilePicture.type.substring(6);
            const path = `users/${userUid}/profile_picture.${profilePictureFileExtension}`;
            return firebase
                .storage()
                .ref()
                .child(path)
                .put(profilePicture)
                .then(this.getProfilePictureURL);
        } else {
            return Promise.resolve();
        }
    };

    getProfilePictureURL = async snapshot => {
        try {
            return await snapshot.ref.getDownloadURL();
        } catch (_) {
            return null;
        }
    };

    render() {
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
                />
            </div>
        ) : (
            <div className={profileCardStyles.profileCardImageInput}>
                <div className={profileCardStyles.profileCardImageInputImgPlaceholder}></div>
                <ImageInput
                    inputName='profilePictureInput'
                    buttonName={"Select a profile picture"}
                    onChange={this.imageInputValueChangedHandler}
                />
            </div>
        );

        return (
            <div className={authStyles.authCard}>
                <h3 className={authStyles.authCardHeading}>Your Profile</h3>
                <form className={authStyles.authCardForm} onSubmit={this.submitHandler}>
                    {imageInput}
                    <div className={profileCardStyles.profileCardTextInputs}>
                        <TextInput
                            inputType={"text"}
                            inputName={"firstName"}
                            labelText={"First Name"}
                            value={this.state.formData.firstName}
                            isRequired={true}
                            onChange={this.textInputValueChangedHandler}
                        />
                        <TextInput
                            inputType={"text"}
                            inputName={"lastName"}
                            labelText={"Last Name"}
                            value={this.state.formData.lastName}
                            isRequired={true}
                            onChange={this.textInputValueChangedHandler}
                        />
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

export default ProfileCard;
