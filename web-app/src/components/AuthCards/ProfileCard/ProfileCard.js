// ----------------------------------------------------------------------------
// File Path: src/components/AuthCards/ProfileCard/ProfileCard.js
// Description: Renders the profile card component
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 1/6/2020
// ----------------------------------------------------------------------------

import React, { Component } from "react";
import TextInput from "../../FormInputs/TextInput/TextInput";
import ImageUpload from "../../FormInputs/ImageUpload/ImageUpload";
import RectangularButton from "../../Buttons/RectangularButton/RectangularButton";
import TextButton from "../../Buttons/TextButton/TextButton";
import closeIconRed from "../../../assets/icons/close-icon-red-fa.svg";
import profileCardStyles from "./ProfileCard.module.scss";
import authStyles from "../AuthCard.module.scss";

class ProfileCard extends Component {
    state = {
        uploadedImageSrc: null
    };

    imageUploadHandler = event => {
        console.log(event.target.files[0]);
        this.setState({ uploadedImageSrc: URL.createObjectURL(event.target.files[0]) });
    };

    removeImageHandler = event => {
        event.target.parentNode.parentNode.parentNode.querySelector("#profilePictureInput").value =
            "";
        this.setState({ uploadedImageSrc: null });
    };

    render() {
        console.log(this.state.uploadedImageSrc);
        return (
            <div className={authStyles.authCard}>
                <h3 className={authStyles.authCardHeading}>Your Profile</h3>
                <form className={authStyles.authCardForm} onSubmit={this.submitHandler}>
                    <div className={profileCardStyles.profileCardImageInput}>
                        {this.state.uploadedImageSrc ? (
                            <div className={profileCardStyles.profileCardImageInputImgContainer}>
                                <img
                                    src={this.state.uploadedImageSrc}
                                    className={profileCardStyles.profileCardImageInputImg}
                                    alt='Profile Picture'
                                />
                                <button type='button' onClick={this.removeImageHandler}>
                                    <img
                                        className={
                                            profileCardStyles.profileCardImageInputRemoveButton
                                        }
                                        src={closeIconRed}
                                        alt={"Remove Profile Picture"}
                                    />
                                </button>
                            </div>
                        ) : (
                            <div className={profileCardStyles.profileCardImageInputImg}></div>
                        )}
                        <ImageUpload
                            inputName='profilePictureInput'
                            buttonName={"Select a profile picture"}
                            onChange={this.imageUploadHandler}
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
