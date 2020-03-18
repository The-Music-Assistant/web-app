// ----------------------------------------------------------------------------
// File Path: src/vendors/AlphaTab/actions.js
// Description: AlphaTab actions
// Author: Daniel Griessler & Dan Levy
// Email: dgriessler20@gmail.com & danlevy124@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// File imports
import { startPitchDetection } from "../ML5/PitchDetection/actions";
import NoteList from "./NoteList";
import {
    getSpecificSheetMusic,
    getPartSheetMusic,
    getExercise,
    getSinglePartSheetMusic
} from "../../vendors/AWS/tmaApi";
import TexLoaded from "./TexLoaded";
import { sheetMusicError } from "../../vendors/Firebase/logs";
import { store } from "../../store/reduxSetup";
import * as playerStates from "./playerStates";
import * as sketchBehaviors from "../P5/sketchBehaviors";
import atVars from "./variables";

/**
 * Starts playing the sheet music and getting pitches from the microphone
 */
export const startPlayingMusic = () => {
    atVars.shouldResetDrawPositions = true; // Signals to p5Obj to draw from the beginning
    atVars.playerState = playerStates.PLAYING; // Changes current state to playing

    // Since AlphaTab might have re rendered, try and update the top line and distance between lines in the drawer
    try {
        let topLine = document.getElementById("rect_0");
        let nextLine = document.getElementById("rect_1");
        const topLineHeight = topLine.y.animVal.value;

        const distanceBetweenLines = nextLine.y.animVal.value - topLineHeight;
        atVars.drawer.setTopLineAndDistanceBetween(
            topLineHeight + 1,
            distanceBetweenLines,
            atVars.texLoaded.getStartOctave()
        );
    } catch (error) {
        sheetMusicError(null, error, "[alphaTabControls/alphaTabPlayerStateChanged]");
    }

    // TODO: Prevent playback range also during playing
    atVars.api.playbackRange = null; // Stops the default behavior of AlphaTab playing on the selected playback range if present
    atVars.api.timePosition = 0; // Start playing at the beginning of the piece

    // Runs the pitch detection model on microphone input and displays it on the screen
    // TODO: Don't show player controls (e.g. play and pause buttons) until AlphaTab and ML5 are ready
    startPitchDetection();
};

/**
 * Change which track Alpha Tab is rendering based on the given part name
 * @param {string} partName - The part name to change to. Part names are expected to be "tx" where x is the track number
 */
export const changePart = partName => {
    let trackNumber = parseInt(partName.substring(1), 10);
    // If we have the track number that is being asked then switch to that track
    if (!atVars.texLoaded.currentTrackIndexes.includes(trackNumber)) {
        atVars.texLoaded.updateCurrentTrackIndexes(trackNumber);

        atVars.api.renderTracks([atVars.api.score.tracks[atVars.texLoaded.currentTrackIndexes[0]]]);

        // sends out request for the expected performance of the currently rendered track
        // assumes user wants to sing the selected part and will draw the green/yellow/red line appropriately
        // TODO: Discuss with client and users, is this correct behavior? Do they want to always see red/yellow/green for their part only
        let data = {
            sheetMusicId: store.getState().practice.selectedSheetMusicId,
            partName: atVars.texLoaded.partNames[trackNumber]
        };
        getPartSheetMusic(data)
            .then(response => {
                atVars.noteStream = response.data.performance_expectation;
                atVars.noteList.updateBounds(
                    response.data.lower_upper[0],
                    response.data.lower_upper[1]
                );
                atVars.texLoaded.typeOfTex = "Sheet Music";
            })
            .catch(error => {
                sheetMusicError(
                    error.response.status,
                    error.response.data,
                    "[alphaTabControls/changePart]"
                );
            });
    }
};

export const changeToSheetMusic = async () => {
    atVars.sketchBehavior = sketchBehaviors.REAL_TIME_FEEDBACK;
    atVars.api.settings.display.barCount = atVars.barCount;
    atVars.api.updateSettings();
    await loadTex();
}

export const changeToMyPart = async () => {
    atVars.sketchBehavior = sketchBehaviors.REAL_TIME_FEEDBACK;
    atVars.api.settings.display.barCount = atVars.barCount;
    atVars.api.updateSettings();
    await loadJustMyPart();
}

export const changeToPerformance = async() => {
    atVars.sketchBehavior = sketchBehaviors.PERFORMANCE_HIGHLIGHTING;
    atVars.api.settings.display.barCount =
        atVars.sheetMusicLength !== null ? atVars.sheetMusicLength : atVars.barCount;
    atVars.api.updateSettings();
    await loadTex();
}

/**
 * Cause AlphaTab to generate an exercise of the current part from measureStart to measureEnd
 * @param {number} measureStart - The start measure number. Note: It is assumed that this has already been error checked
 * @param {number} measureEnd - The end measure number. Note: It is assumed that this has already been error checked
 */
export const changeToExercise = async(measureStart, measureEnd) => {
    if (!measureStart || !measureEnd) {
        return;
    } else {
        atVars.sketchBehavior = sketchBehaviors.REAL_TIME_FEEDBACK;
        atVars.api.settings.display.barCount = atVars.barCount;
        atVars.api.updateSettings();
        await loadExercise(measureStart, measureEnd);
    }
}

/**
 * Converts a time position in seconds to what measure that it occurs in
 * @param {number} currentPosition - The current time position that we are on
 * @param {number} currentMeasure - The current measure number that we are on
 * @param {number[]} measureToLength - Array holding the length of each measure in seconds
 */
export const timeToMeasureNumber = (currentPosition, currentMeasure, measureToLength) => {
    // specify how close that we need to get to the target position before we are confident that we are in the correct measure
    const EPSILON = 0.01;
    let tempCurrentPosition = currentPosition;
    let tempCurrentMeasure = currentMeasure;
    while (tempCurrentPosition > EPSILON) {
        tempCurrentPosition -= measureToLength[tempCurrentMeasure - 1];
        tempCurrentMeasure++;
    }
    return tempCurrentMeasure;
};

/**
 * Converts the playback range if defined in AlphaTab to the measure numbers that start and end that range
 * @returns Either an array with the start and end measure numbers or null if there is no playback range
 */
export const getPlaybackRange = () => {
    const measureToLength = atVars.texLoaded.measureLengths;
    let playbackMeasures = null;
    if (measureToLength !== null) {
        if (atVars.api.playbackRange !== null) {
            playbackMeasures = [];
            let currentPosition = atVars.api.timePosition / 1000; // timeposition is tied to the bar cursor position in milliseconds so divide by 1000 to get seconds
            let comparePosition = currentPosition;
            // The time position is used to set up a ratio to figure out where the end measure should be
            // A special case occurs when the time position is at 0 seconds since the ratio will cause a divide by 0 error
            // To attempt to fix this, we try and set the api time position to the end of the first measure to get a good ratio
            // TODO: Fix this for the 1st measure, this solution isn't working
            if (currentPosition === 0) {
                atVars.api.timePosition = measureToLength[0];
                comparePosition = atVars.api.tickPosition;
            }
            let ratio = atVars.api.tickPosition / comparePosition;
            // calculates the end time of the range based on ratio of the start position
            let targetEndTime =
                atVars.api.playbackRange.endTick / ratio -
                atVars.api.playbackRange.startTick / ratio;
            let currentMeasure = 1;
            currentMeasure = timeToMeasureNumber(currentPosition, currentMeasure, measureToLength);
            // saves the start measure number of the playback range
            playbackMeasures.push(currentMeasure);

            currentPosition = targetEndTime;
            currentMeasure = timeToMeasureNumber(currentPosition, currentMeasure, measureToLength);
            // saves the end measure number of the playback range
            playbackMeasures.push(currentMeasure - 1);
        }
    }
    return playbackMeasures;
};

// /**
//  * Sets the target track to either be muted or not. If checked then the target track will not be muted
//  * @param {Boolean} isChecked - If true then we want to hear this track, otherwise mute this track
//  * @param {String} name - Name of the track to be heard or muted
//  */
// const changeTrackVolume = (isChecked, name) => {
//     if (texLoaded) {
//         let partIndex = texLoaded.partNames.indexOf(name);
//         if (partIndex > -1) {
//             texLoaded.mutedTracks[partIndex] = !isChecked;
//             let muteTrackList = [];
//             let playTrackList = [];
//             for (let i = 0; i < texLoaded.mutedTracks.length; i++) {
//                 if (texLoaded.mutedTracks[i]) {
//                     muteTrackList.push(i);
//                 } else {
//                     playTrackList.push(i);
//                 }
//             }
//             // api.changeTrackMute(muteTrackList, true);
//             // api.changeTrackMute(playTrackList, false);
//             api.changeTrackMute([partIndex], !isChecked)
//         }
//     }
// }

/**
 * Loads just the user's part for this sheet music logging it as an exercise and isolates their part for playback
 */
export const loadJustMyPart = async () => {
    // Clears the "exercise" option from the texToDisplay drop down if present since that is only generated when viewing an exercise
    let texToDisplay = document.getElementById("texToDisplay");
    texToDisplay.options[3] = null;

    try {
        const singlePartResponse = await getSinglePartSheetMusic({
            sheetMusicId: store.getState().practice.selectedSheetMusicId
        });
        // update the wrapper for the loaded tex since it has changed
        atVars.texLoaded.update(
            "Sheet Music",
            singlePartResponse.data.part_list,
            singlePartResponse.data.clefs,
            singlePartResponse.data.part,
            null,
            1,
            1
        );
        // update the current track index and re render the track
        atVars.texLoaded.updateCurrentTrackIndexes(0);
        atVars.api.tex(singlePartResponse.data.sheet_music, atVars.texLoaded.currentTrackIndexes);

        // Update the sheetMusicPart drop down list with the new list of parts
        updateDropdown(singlePartResponse.data.part_list);

        // updates the expected performance of the music and several internal variables about the loaded sheet music
        atVars.noteStream = singlePartResponse.data.performance_expectation;
        atVars.noteList.clear();
        atVars.noteList.updateBounds(
            singlePartResponse.data.lower_upper[0],
            singlePartResponse.data.lower_upper[1]
        );
        atVars.texLoaded.setMeasureLengths(
            singlePartResponse.data.measure_lengths,
            atVars.barCount
        );
        atVars.sheetMusicLength = atVars.texLoaded.measureLengths.length;
        atVars.texLoaded.updateLengthsPerSection(
            1,
            atVars.texLoaded.measureLengths.length + 1,
            atVars.barCount
        );
        atVars.texLoaded.typeOfTex = "Sheet Music";
    } catch (error) {
        sheetMusicError(
            error.response.status,
            error.response.data,
            "[alphaTabControls/loadJustMyPart]"
        );
    }
};

/**
 * Loads an exercise based on user provided measure numbers
 * @param {number} measureStart - The start measure number. Note: It is assumed that this has already been error checked
 * @param {number} measureEnd - The end measure number. Note: It is assumed that this has already been error checked
 */
const loadExercise = async (measureStart, measureEnd) => {
    // Adds and auto selects the "exercise" option from the texToDisplay drop down which only lasts as long as we are viewing this exercise
    let texToDisplay = document.getElementById("texToDisplay");
    texToDisplay.options[3] = new Option("Exercise", "exercise", false, true);

    // Assumes currentTrackIndexes[0], measureStart, and measureEnd are valid by this point
    // Defaults to non duration exercise
    // TODO: Get duration exercise if measure needs a lot of work, otherwise get normal exercise
    let data = {
        sheetMusicId: store.getState().practice.selectedSheetMusicId,
        trackNumber: atVars.texLoaded.currentTrackIndexes[0] + 1,
        staffNumber: 1,
        measureStart,
        measureEnd,
        isDurationExercise: false
    };

    // TODO: Save responses so that we don't have to ask for them each time. Note: You will still need to save this as an exercise count
    const exerciseResponse = await getExercise(data);
    try {
        // update wrapper about new sheet music and re render
        atVars.texLoaded.update(
            "Exercise",
            exerciseResponse.data.part_list,
            exerciseResponse.data.clefs,
            exerciseResponse.data.part,
            exerciseResponse.data.exerciseId,
            measureStart,
            measureEnd
        );
        atVars.api.tex(exerciseResponse.data.sheet_music, atVars.texLoaded.currentTrackIndexes);

        // Update the sheetMusicPart drop down list with the new list of parts
        updateDropdown(exerciseResponse.data.part_list);

        // updates the expected performance of the music and several internal variables about the loaded sheet music
        atVars.noteStream = exerciseResponse.data.performance_expectation;
        atVars.noteList.clear();
        atVars.noteList.updateBounds(
            exerciseResponse.data.lower_upper[0],
            exerciseResponse.data.lower_upper[1]
        );
        atVars.texLoaded.setMeasureLengths(exerciseResponse.data.measure_lengths, atVars.barCount);
    } catch (error) {
        sheetMusicError(
            error.response.status,
            error.response.data,
            "[alphaTabControls/loadExercise]"
        );
    }
};

/**
 * TODO: This function likely will be removed when UI updates are made
 */
export const updateDropdown = partList => {
    // TODO: Once track muting is fixed, uncomment to re add it
    // let trackVolume = document.getElementById("volumeTracks");
    // const numberOfChildren = trackVolume.children.length;
    // for (let i = 0; i < numberOfChildren; i++) {
    //     trackVolume.removeChild(trackVolume.lastElementChild);
    // }
    let sheetMusicPartDropdown = document.getElementById("sheetMusicPart");
    if (sheetMusicPartDropdown) {
        let i = 0;
        for (; i < partList.length; i++) {
            sheetMusicPartDropdown.options[i] = new Option(partList[i], "t" + i, false, false);

            // const newTrackVolume = document.createElement('li');
            // const x = document.createElement("INPUT");
            // x.setAttribute("type", "checkbox");
            // x.checked = true;
            // newTrackVolume.appendChild(x);
            // newTrackVolume.appendChild(document.createTextNode(partList[i]));
            // newTrackVolume.onclick = function() {
            //     changeTrackVolume(children[0].checked, innerText);
            // };
            // trackVolume.appendChild(newTrackVolume);
        }
        let optionsLength = sheetMusicPartDropdown.options.length;
        let lastIndex = i;
        for (; i < optionsLength; i++) {
            sheetMusicPartDropdown.options[lastIndex] = null;
        }
    }
};

/**
 * Loads the overall sheet music defaulting to showing the user's part for the song
 */
const loadTex = async () => {
    // Clears the "exercise" option from the texToDisplay drop down if present since that is only generated when viewing an exercise
    // let texToDisplay = document.getElementById("texToDisplay");
    // texToDisplay.options[3] = null;

    let data = {
        sheetMusicId: store.getState().practice.selectedSheetMusicId
    };

    // TODO: Save this response so that we can switch back to the sheet music without having to re-request the sheet music from the database
    try {
        const sheetMusicResponse = await getSpecificSheetMusic(data);
        let partList = sheetMusicResponse.data.part_list;
        // Initializes wrapper about the sheet music if first render or updates wrapper if already present
        if (atVars.texLoaded === null) {
            atVars.texLoaded = new TexLoaded(
                "Sheet Music",
                partList,
                sheetMusicResponse.data.clefs,
                sheetMusicResponse.data.part,
                null,
                1,
                1,
                store.getState().practice.selectedSheetMusicId
            );
        } else {
            atVars.texLoaded.update(
                "Sheet Music",
                partList,
                sheetMusicResponse.data.clefs,
                sheetMusicResponse.data.part,
                null,
                1,
                1
            );
        }

        // Update the sheetMusicPart drop down list with the new list of parts
        updateDropdown(partList);

        // Isolates the user's part from the part list setting it to be the displayed track when alpha tab renders
        for (let i = 0; i < partList.length; i++) {
            if (partList[i] === atVars.texLoaded.myPart) {
                atVars.texLoaded.updateCurrentTrackIndexes(i);
                let sheetMusicPartDropdown = document.getElementById("sheetMusicPart");
                if (sheetMusicPartDropdown) {
                    sheetMusicPartDropdown[i].selected = true;
                }
                break;
            }
        }

        // renders the user's part but plays all the parts together during playback
        atVars.api.tex(sheetMusicResponse.data.sheet_music, atVars.texLoaded.currentTrackIndexes);

        data.partName = sheetMusicResponse.data.part_list[atVars.texLoaded.currentTrackIndexes[0]];

        // gets and updates expected performance data for the user's part
        const partResponse = await getPartSheetMusic(data);
        atVars.noteStream = partResponse.data.performance_expectation;
        atVars.noteList = new NoteList(0);

        // updates several internal variables about the loaded sheet music
        atVars.noteList.updateBounds(
            partResponse.data.lower_upper[0],
            partResponse.data.lower_upper[1]
        );
        atVars.texLoaded.setMeasureLengths(partResponse.data.measure_lengths, atVars.barCount);
        atVars.sheetMusicLength = atVars.texLoaded.measureLengths.length;
        atVars.texLoaded.updateLengthsPerSection(
            1,
            atVars.texLoaded.measureLengths.length + 1,
            atVars.barCount
        );
        atVars.texLoaded.typeOfTex = "Sheet Music";
    } catch (error) {
        sheetMusicError(error.response.status, error.response.data, "[alphaTabControls/loadTex]");
    }
};

/**
 * Gets the member's part for the sheet music (e.g. Soprano)
 * @returns - The member's part
 */
export const getMyPart = () => {
    return atVars.texLoaded ? atVars.texLoaded.myPart : null;
}

/**
 * Gets all parts of the sheet music (e.g. alto, soprano, etc.)
 * @returns - An array of parts
 */
export const getPartList = () => {
    return atVars.texLoaded ? atVars.texLoaded.partNames : null;
}
