// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/ProfileCard/ProfileCard.js
// Description: Renders the profile card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../../vendors/Firebase/firebase";
import "firebase/storage";
import TextInput from "../../FormInputs/TextInput/TextInput";
import ImageInput from "../../FormInputs/ImageInput/ImageInput";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import closeIconRed from "../../../assets/icons/close-icon-red-fa.svg";
import profileCardStyles from "./ProfileCard.module.scss";
import authStyles from "../AuthCard.module.scss";
import { addUser } from "../../../App/musicAssistantApi";
import { firstNameEntered } from "../../../store/actions";
import { PROFILE } from "../../../pages/Auth/authCards";

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

    removeImageHandler = () => {
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
        this.props.firstNameEntered(this.state.formData.firstName);
        if (this.props.isAuthenticated) {
            this.uploadData()
                .then(() => {
                    this.props.setLoading(false);
                    this.props.done(PROFILE);
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
            const profilePicture = this.state.formData.profilePicture;
            if (profilePicture) {
                const profilePictureFileExtension = profilePicture.type.substring(6);
                const userUid = firebase.auth().currentUser.uid;
                await this.uploadProfilePicture(
                    userUid,
                    profilePicture,
                    profilePictureFileExtension
                );
            }
            const userData = { ...this.state.formData };
            delete userData.profilePicture;
            userData.profilePictureUrl = null;
            await addUser(userData);
        } catch (error) {
            console.log(error);
            const newError = new Error();
            newError.message = error.response.data;
            newError.status = error.response.status;
            throw newError;
        }
        this.props.setLoading(false);
    };

    uploadProfilePicture = (userUid, picture, extension) => {
        const path = `users/${userUid}/profile_picture.${extension}`;
        return firebase
            .storage()
            .ref()
            .child(path)
            .put(picture);
    };

    getX = async path => {
        return firebase
            .storage()
            .ref()
            .child(path)
            .getDownloadURL();
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

const mapDispatchToProps = dispatch => {
    return {
        firstNameEntered: firstName => dispatch(firstNameEntered(firstName))
    };
};

export default connect(null, mapDispatchToProps)(ProfileCard);
