/* ----------------------------------------------------------------------------
// File Path: src/App/App.js
// Description: Server API for The Music Assistant
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/8/2020
---------------------------------------------------------------------------- */

import axios from "axios";
import firebase from "firebase";

const API_PORT = "2765";
const BASE_URL = `http://ec2-52-15-61-210.us-east-2.compute.amazonaws.com:${API_PORT}`;

const getFirebaseAuthToken = () => {
    return firebase
            .auth()
            .currentUser.getIdToken();
}

export const addPerson = (firstName, lastName, profilePictureURL) => {
    const data = {
        first_name: firstName,
        last_name: lastName,
        profile_picture_url: profilePictureURL
    }
    return getFirebaseAuthToken()
        .then(authToken => axios.post(`${BASE_URL}/person`, data, {headers: {authToken}}));
    
};
