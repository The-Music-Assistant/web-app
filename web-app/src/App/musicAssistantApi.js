/* ----------------------------------------------------------------------------
// File Path: src/App/App.js
// Description: Server API for The Music Assistant
// Author: Dan Levy
// Email: danlevy124@gmail.com
// Created Date: 2/8/2020
---------------------------------------------------------------------------- */

import axios from "axios";

axios.defaults.baseURL = "https://danielgriessler.com";
// axios.defaults.timeout = 3000;

/**
 * Sets the Axios auth token
 * @param {string} authToken - The auth token to use for API requests
 */
export const setAxiosAuthToken = authToken => {
    axios.defaults.headers.common["Authorization"] = authToken;
};

/**
 * Adds a user to the database
 * @param {Object} data
 * @param {string} data.firstName - The user's first name
 * @param {string} data.lastName - The user's last name
 * @param {string} data.profilePictureUrl - The person's profile picture url
 */
export const addUser = data => {
    console.log(data);
    return axios.post("/person", data);
};

/**
 * Updates a user in the database
 * @param {Object} data
 * @param {string} data.firstName - The user's first name
 * @param {string} data.lastName - The user's last name
 * @param {string} data.profilePictureUrl - The user's profile picture url
 */
export const updateUser = data => {
    return axios.put("/person", data);
};

/**
 * Adds a choir to the database
 * @param {Object} data
 * @param {string} data.choirName - The name of the choir
 * @param {string} data.description - A description of the choir
 * @param {string} pictureURL. - A picture associated with the choir
 * @param {string} data.memberType - The member type of the member creating the choir
 * @param {string} memberRole. - The member role of the member creating the choir
 */
export const addChoir = data => {
    return axios.post("/choir", data);
};

/**
 * Gets the choirs that this user is a part of
 */
export const getUsersChoirs = () => {
    return axios.get("/chor");
};

/**
 * Gets the given choir
 * @param {Object} data
 * @param {string} data.choirId - The choir ID retrieve
 */
export const getChoir = data => {
    return axios.get("/choir/specific", data);
};

/**
 * Accepts a given choir member into the given choir
 * @param {Object} data
 * @param {Object} data.memberId - The member ID of the member to accept
 * @param {string} data.choirId - The choir ID retrieve
 */
export const acceptChoirMember = data => {
    return axios.put("/member/accept", data);
};

/**
 * Rejects a given choir member from entering the given choir
 * @param {Object} data
 * @param {Object} data.memberId - The member ID of the member to reject
 * @param {string} data.choirId - The choir ID retrieve
 */
export const rejectChoirMember = data => {
    return axios.put("/member/reject", data);
};

/**
 * Gets pending users of the given choir
 * @param {Object} data
 * @param {string} data.choirId - The choir ID of the choir to get pending members from
 */
export const getPendingUsers = data => {
    return axios.get("/member/pending", data);
};

/**
 * Adds the user as a pending member of the given choir
 * @param {Object} data
 * @param {string} data.memberType - The member type that you are attempting to join as
 * @param {string} data.memberRole - The member role that you are attempting to join as
 * @param {string} data.accessCode - The access code for the choir you are attempting to join
 */
export const joinChoir = data => {
    return axios.get("/member", data);
};
