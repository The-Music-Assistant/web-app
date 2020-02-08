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
import TextButton from "../../Buttons/TextButton/TextButton";
import closeIconRed from "../../../assets/icons/close-icon-red-fa.svg";
import profileCardStyles from "./ProfileCard.module.scss";
import authStyles from "../AuthCard.module.scss";

class ProfileCard extends Component {
    state = {
        formData: {
            profilePicture: null,
            firstName: null,
            lastName: null,
            type: "student",
            role: null
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

    removeImageHandler = event => {
        event.target.parentNode.parentNode.parentNode.querySelector("#profilePictureInput").value =
            "";
        this.setState({ uploadedImageSrc: null });
    };

    submitHandler = event => {
        event.preventDefault();
        const profilePicture = this.state.formData.profilePicture;
        if (this.props.isAuthenticated && profilePicture) {
            const userUid = firebase.auth().currentUser.uid;
            const profilePictureFileExtension = profilePicture.type.substring(6);
            console.log(firebase);
            firebase
                .storage()
                .ref()
                .child(`${userUid}/profile_picture.${profilePictureFileExtension}`)
                .put(profilePicture)
                .then(console.log("Profile image uploaded!"))
                .catch(error => console.log(error));
        }
    };

    render() {
        const imageInputPreview = this.state.formData.profilePicture ? (
            <div className={profileCardStyles.profileCardImageInputImgContainer}>
                <img
                    src={URL.createObjectURL(this.state.formData.profilePicture)}
                    className={profileCardStyles.profileCardImageInputImg}
                    alt='Profile Picture'
                />
                <button type='button' onClick={this.removeImageHandler}>
                    <img
                        className={profileCardStyles.profileCardImageInputRemoveButton}
                        src={closeIconRed}
                        alt={"Remove Profile Picture"}
                    />
                </button>
            </div>
        ) : (
            <div className={profileCardStyles.profileCardImageInputImg}></div>
        );

        return (
            <div className={authStyles.authCard}>
                <h3 className={authStyles.authCardHeading}>Your Profile</h3>
                <form className={authStyles.authCardForm} onSubmit={this.submitHandler}>
                    <div className={profileCardStyles.profileCardImageInput}>
                        {imageInputPreview}
                        <ImageInput
                            inputName='profilePictureInput'
                            buttonName={"Select a profile picture"}
                            onChange={this.imageInputValueChangedHandler}
                        />
                    </div>

                    <div className={authStyles.authCardSubmitButtonContainer}>
                        <RectangularButton
                            type='submit'
                            value='submit'
                            text='Next'
                            backgroundColor='green'
                            center='true'
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default ProfileCard;
