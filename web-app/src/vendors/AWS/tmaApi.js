/**
 * The server API for this app
 * @module tmaApi
 * @author Dan Levy <danlevy124@gmail.com>
 */

import axios from "axios";

axios.defaults.baseURL = "https://server.music-assistant.com/";

/**
 * @typedef {object} ServerError
 * @property {object} response - The error response
 * @property {string} response.status - The error status code
 * @property {object} response.data - The error data (usually just a string)
 */

/**
 * Sets the Axios auth token
 * The auth token only needs to be set when auth changes
 * @param {string} authToken - The auth token to use for API requests
 */
export const setAxiosAuthToken = (authToken) => {
    axios.defaults.headers.common["Authorization"] = authToken;
};

/**
 * @typedef {object} User
 * @property {string} firstName - The user's first name
 * @property {string} lastName - The user's last name
 * @property {boolean} hasPicture - Indicates whether the user has a profile picture
 */

/**
 * Gets the current user's first name, last name, and has picture boolean
 * @returns {Promise<User|ServerError>} - A promise containing the user or an error
 */
export const getUser = () => {
    return axios.get("/person");
};

/**
 * Adds a user to the database
 * @param {object} data
 * @param {string} data.firstName - The user's first name
 * @param {string} data.lastName - The user's last name
 * @param {bool} data.hasPicture - Indicates whether or not the user uploaded a picture
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const addUser = (data) => {
    return axios.post("/person", data);
};

/**
 * Updates a user in the database
 * @param {object} data
 * @param {string} data.firstName - The user's first name
 * @param {string} data.lastName - The user's last name
 * @param {boolean} data.hasPicture - Indicates whether or not the user uploaded a picture
 * @return {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const updateUser = (data) => {
    return axios.put("/person", data);
};

/**
 * @typedef {object} ChoirPostPackage
 * @property {string} accessCode The access code of the generated choir
 */

/**
 * Adds a choir to the database
 * @param {object} data
 * @param {string} data.choirName - The name of the choir
 * @param {string} data.description - A description of the choir
 * @param {string} data.memberType - The member type of the member creating the choir
 * @param {string} data.memberRole - The member role of the member creating the choir
 * @returns {Promise<ChoirPostPackage|ServerError>} - A promise containing the access code of the generated choir or an error
 */
export const addChoir = (data) => {
    return axios.post("/choir", data);
};

/**
 * @typedef {object} ChoirGetPackage
 * @property {ChoirGetReturnPackage[]} choirs Information on each choir retrieved
 */

/**
 * @typedef {object} ChoirGetReturnPackage
 * @property {string} choir_id The ID of the choir
 * @property {string} choir_name The name of the choir
 * @property {string} description A description of the choir
 */

/**
 * Gets the choirs that this user is a part of
 * @returns {Promise<ChoirGetPackage|ServerError>} - A promise containing choir information or an error
 */
export const getUsersChoirs = () => {
    return axios.get("/choir");
};

/**
 * @typedef {ChoirGetMembersReturnPackage[]} ChoirGetMembersPackage Information about the retrieved members from the choir
 */

/**
 * @typedef {object} ChoirGetMembersReturnPackage
 * @property {string} first_name The first name of the member
 * @property {string} last_name The last name of the member
 * @property {string} member_role The role of the member
 * @property {string} person_id The ID of the person attached to the member
 * @property {boolean} has_picture Whether the given member is attached to a person with a profile picture or not
 */

/**
 * Gets the given choir members
 * @param {object} data
 * @param {string} data.choirId - The choir ID retrieve
 * @returns {Promise<ChoirGetMembersPackage|ServerError>} - A promise containing member information or an error
 */
export const getChoirMembers = (data) => {
    return axios.request({
        method: "GET",
        url: "/choir/members",
        params: data,
    });
};

/**
 * Accepts a given choir member into the given choir
 * @param {object} data
 * @param {object} data.memberId - The member ID of the member to accept
 * @param {string} data.choirId - The choir ID retrieve
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const acceptChoirMember = (data) => {
    return axios.put("/member/accept", data);
};

/**
 * Rejects a given choir member from entering the given choir
 * @param {object} data
 * @param {object} data.memberId - The member ID of the member to reject
 * @param {string} data.choirId - The choir ID retrieve
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const rejectChoirMember = (data) => {
    return axios.put("/member/reject", data);
};

/**
 * @typedef {MemberGetPendingReturnPackage[]} MemberGetPendingPackage List of information about the pending members
 */

/**
 * @typedef {object} MemberGetPendingReturnPackage
 * @property {string} member_id The ID of the member
 * @property {string} first_name The first name of the member
 * @property {string} email The email of the member
 * @property {string} member_type The type of the member
 * @property {string} member_role The role of the member
 * @property {boolean} has_picture Whether the person attached to the member has a profile picture
 */

/**
 * Gets pending members of the given choir
 * @param {object} data
 * @param {string} data.choirId - The choir ID of the choir to get pending members from
 * @returns {Promise<MemberGetPendingPackage|ServerError>} - A promise containing pending member information or an error
 */
export const getPendingMembers = (data) => {
    return axios.request({
        method: "GET",
        url: "/member/pending",
        params: data,
    });
};

/**
 * @typedef {object} MemberGetGetsFeedbackPackage
 * @property {boolean} gets_feedback Whether the user gets feedback or not
 */

/**
 * Gets if the user recieves feedback
 * @param {Object} data
 * @param {string} data.sheetMusicId - The sheet music the user is singing
 * @returns {Promise<MemberGetGetsFeedbackPackage|ServerError>} - A promise containing whether the user gets feedback or an error
 */
export const userGetsFeedback = (data) => {
    return axios.request({
        method: "GET",
        url: `/member/gets-feedback`,
        params: data,
    });
};

/**
 * Adds the user as a pending member of the given choir
 * @param {object} data
 * @param {string} data.memberType - The member type that you are attempting to join as
 * @param {string} data.memberRole - The member role that you are attempting to join as
 * @param {string} data.accessCode - The access code for the choir you are attempting to join
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const joinChoir = (data) => {
    return axios.post("/member", data);
};

/**
 * @typedef {object} SheetMusicGetPackage
 * @property {SheetMusicGetReturnPackage[]} sheet_music Information about each piece of sheet music
 */

/**
 * @typedef {object} SheetMusicGetReturnPackage
 * @property {string} sheet_music_id The ID of the sheet music
 * @property {string} title The title of the sheet music
 * @property {string} composer_names Metadata about the creators of the sheet music
 */

/**
 * Gets all sheet music for a choir
 * @param data
 * @param {string} data.choirId - Will get all sheet music with this choir id which the user has access to
 * @returns {Promise<SheetMusicGetPackage|ServerError>} - A promise containing sheet music information or an error
 */
export const getSheetMusic = (data) => {
    return axios.request({
        method: "GET",
        url: `/sheet-music`,
        params: data,
    });
};

/**
 * @typedef {object} SheetMusicGetSpecificPackage
 * @property {string} sheet_music The AlphaTex of the sheet music
 * @property {string[]} part_list A list of the part (i.e. track) names
 * @property {string[]} clefs The clefs per staff
 * @property {string} part If not null, then the part of the current user in the sheet music
 */

/**
 * Gets a specific piece of sheet music
 * @param {object} data
 * @param {string} data.sheetMusicId - The sheet music id to retrieve
 * @returns {Promise<SheetMusicGetSpecificPackage|ServerError>} - A promise containing sheet music information or an error
 */
export const getSpecificSheetMusic = (data) => {
    return axios.request({
        method: "GET",
        url: "/sheet-music/specific",
        params: data,
    });
};

/**
 * @typedef {object} SheetMusicGetPartPackage
 * @property {number[]} performance_expectation A 1D array of even size with the ith index as the midi value and the i+1 index as the duration of that note for i%2==0
 * @property {number[]} lower_upper A 1D two valued array with the lower and upper midi values
 * @property {number[]} measure_lengths A collection of the lengths of each Measure. The ith index contains the length in seconds of the i+1 Measure
 */

/**
 * Gets a specific part from a specific piece of sheet music
 * @param {object} data
 * @param {string} data.sheetMusicId - The sheet music id to retrieve
 * @param {string} data.partName - The name of the part to be retrieved
 * @returns {Promise<SheetMusicGetPartPackage|ServerError>} - A promise containing part information or an error
 */
export const getPartSheetMusic = (data) => {
    return axios.request({
        method: "GET",
        url: "/sheet-music/part",
        params: data,
    });
};

/**
 * @typedef {object} MemberPostNewNoAnalysisPackage
 * @property {string} performance_id The ID of the newly generated performance data
 */

/**
 * Initalizes a performance for the current user for the provided sheet music
 * @param {Object} data
 * @param {string} data.performanceData - The performance data to be added
 * @param {string} data.sheetMusicId - The sheet music id to add the performance to, also used to authenticate user so this is required
 * @param {string} data.exerciseId - If not null then the performance will be attached to this exercise otherwise attached to sheet music
 * @param {Boolean} data.isDurationExercise - If exercise, specify if it is a duration exercise
 * @param {number} data.measureStart - Start of performance
 * @param {number} data.measureEnd - End of performance
 * @returns {Promise<MemberPostNewNoAnalysisPackage|ServerError>} - A promise containing the performance id or an error
 */
export const initializeRunningPerformance = (data) => {
    return axios.post("/performance/new/no-analysis", data);
};

/**
 * Adds a new performance for the current user for the provided sheet music and analyzes it immediately
 * @param {Object} data
 * @param {string} data.performanceData - The performance data to be added
 * @param {string} data.sheetMusicId - The sheet music id to add the performance to, also used to authenticate user so this is required
 * @param {string} data.exerciseId - If not null then the performance will be attached to this exercise otherwise attached to sheet music
 * @param {Boolean} data.isDurationExercise - If exercise, specify if it is a duration exercise
 * @param {number} data.measureStart - Start of performance
 * @param {number} data.measureEnd - End of performance
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const addPerformance = (data) => {
    return axios.post("/performance/new/analysis", data);
};

/**
 * Updates a stored performance with additional values
 * @param {Object} data
 * @param {string} data.performanceData - The performance data to be added
 * @param {string} data.performanceId - The performance id to update
 * @param {string} data.sheetMusicId - The sheet music id for the performance
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const updateRunningPerformance = (data) => {
    return axios.put("/performance/no-analysis", data);
};

/**
 * Closes out a running performance with the most recent data and asks to analyze it
 * @param {Object} data
 * @param {string} data.performanceData - The performance data to be added
 * @param {string} data.performanceId - The performance id to update
 * @param {string} data.sheetMusicId - The sheet music id for the performance
 * @param {string} data.exerciseId - If not null then the performance will be attached to this exercise otherwise attached to sheet music
 * @param {Boolean} data.isDurationExercise - If exercise, specify if it is a duration exercise
 * @param {number} data.measureStart - Start of performance
 * @param {number} data.measureEnd - End of performance
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const closeRunningPerformance = (data) => {
    return axios.put("/performance/analysis", data);
};

/**
 * Updates a choir member
 * Must be an admin of the choir to update a member
 * @param {object} data
 * @param {string} data.memberId
 * @param {string} data.memberType
 * @param {string} data.memberRole
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const constUpdateMember = (data) => {
    return axios.put("/member/update", data);
};

/**
 * Deletes a choir member
 * Must be an admin of the choir to update a member
 * @param {object} data
 * @param {string} data.memberId
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const deleteMember = (data) => {
    return axios.delete("/member", data);
};

/**
 * Gets all performances for the user for a given piece of sheet music
 * @param {object} data
 * @param {string} data.sheetMusicId
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const getUsersPerformancesForSheetMusic = (data) => {
    return axios.request({
        method: "GET",
        url: "/performance/all",
        params: data,
    });
};

/**
 * @typedef {object} ExerciseGetPackage
 * @property {string} sheet_music The Tex for the exercise
 * @property {string[]} part_list A list of the part names of the AlphaTex
 * @property {string[]} clefs A list of clefs per staff
 * @property {number[]} performance_expectation A 1D array of even size with the ith index as the midi value and the i+1 index as the duration of that note for i%2==0
 * @property {number[]} lower_upper A 1D two valued array with the lower and upper midi values
 * @property {number[]} measure_lengths A collection of the lengths of each Measure. The ith index contains the length in seconds of the i+1 Measure
 * @property {string} part The name of the main exercise to be rendered
 */

/**
 * Gets the alphaTex for an exercise
 * @param {Object} data
 * @param {string} data.sheetMusicId - The sheet music id from which to generate the exercise
 * @param {number} data.trackNumber - The track number to access (note: this is +1 more than the track index for any array)
 * @param {number} data.staffNumber - The staff number to access (note: this is +1 more than the staff index for any array)
 * @param {number} data.measureStart - The measure number to start with
 * @param {number} data.measureEnd - The measure number to end with
 * @param {Boolean} data.isDurationExercise - If true, generates a duration exercise otherwise just a normal exercise
 * @returns {Promise<ExerciseGetPackage|ServerError>} - A promise containing information about the exercise or an error
 */
export const getExercise = (data) => {
    return axios.request({
        method: "GET",
        url: `/exercise`,
        params: data,
    });
};

/**
 * @typedef {object} SheetMusicPartGetPackage
 * @property {string} sheet_music The created AlphaTex isolating the user's part
 * @property {string[]} part_list A list of part (i.e. track) names in the generated AlphaTex
 * @property {string[]} clefs Clefs per staff
 * @property {number[]} performance_expectation A 1D array of even size with the ith index as the midi value and the i+1 index as the duration of that note for i%2==0
 * @property {number[]} lower_upper A 1D two valued array with the lower and upper midi values
 * @property {number[]} measure_lengths A collection of the lengths of each Measure. The ith index contains the length in seconds of the i+1 Measure
 * @property {string} exerciseId The ID of the exercise created
 */

/**
 * Gets the sheet music and performance data for the user's specific part
 * @param {Object} data
 * @param {string} data.sheetMusicId - The sheet music id to retrieve the part from
 * @returns {Promise<SheetMusicPartGetPackage|ServerError>} - A promise containing information the sheet music or an error
 */
export const getSinglePartSheetMusic = (data) => {
    return axios.request({
        method: "GET",
        url: `/sheet-music-part`,
        params: data,
    });
};

/**
 * Adds selected part to sheet music for given member receiving nothing
 * @param {Object} data
 * @param {string} data.sheetMusicId - The sheet music id to which the part for the member is being added
 * @param {string} data.part - The part from the sheet music that the member is selecting
 * @param {string} data.memberId - The member who is selecting a part
 * @returns {Promise<ServerError>} - A promise containing nothing on success or an error
 */
export const pickPartInSheetMusic = (data) => {
    return axios.post("/sheet-music-part", data);
};
