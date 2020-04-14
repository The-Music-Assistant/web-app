// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/actions.js
// Description: Pitch detection actions
// Author: Dan Levy & Daniel Griessler
// Email: danlevy124@gmail.com & dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

/**
 * Pitch detection actions
 * @module actions
 * @author Daniel Griessler <dgriessler20@gmail.com> & Dan Levy <danlevy124@gmail.com>
 */

// File imports
import atVars from "../../AlphaTab/variables";
import ptVars from "./variables";
import {
    initializeRunningPerformance,
    updateRunningPerformance,
    addPerformance,
    closeRunningPerformance,
} from "../../../vendors/AWS/tmaApi";
import { sheetMusicError } from "../../Firebase/logs";
import * as playerStates from "../../AlphaTab/playerStates";

/**
 * Checks if pitch detection is available
 * As part of the check, also checks if the microphone is available
 * @returns {boolean} True if pitch detection is available; false otherwise
 */
export const isPitchDetectionAvailable = () => {
    if (
        !ptVars.audioContext ||
        !ptVars.pitchDetectionModel ||
        !ptVars.micStream
    ) {
        // If any of the ptVars are undefined or null, pitch detection is not available (nor is the microphone)
        return false;
    }

    // Pitch detection is available
    return true;
};

/**
 * Continuously detects pitch and displays it on the screen
 * @returns {string} The id of the current setInterval process (this can be used to stop the current setInterval process)
 */
export const startPitchDetection = () => {
    atVars.texLoaded.performanceId = null;
    atVars.noteList.clear();
    if (atVars.getsFeedback && isPitchDetectionAvailable()) {
        atVars.p5Obj.loop();
    }
    pageWatch(0, 0);
    listen();
};

/**
 * Sends performance information to the database for the current page
 */
export const pageTurn = async () => {
    let sheetMusicId = atVars.texLoaded.sheetMusicId;
    if (atVars.texLoaded.performanceId === null) {
        let performanceData = {
            performanceData: JSON.stringify(
                JSON.parse(JSON.stringify(atVars.noteList.performanceData))
            ),
            sheetMusicId,
            exerciseId: null,
            measureStart: atVars.texLoaded.measureStart,
            measureEnd: atVars.texLoaded.measureEnd,
            isDurationExercise: false,
        };
        if (
            atVars.texLoaded.typeOfTex === "Exercise" &&
            atVars.texLoaded.id !== null
        ) {
            performanceData.exerciseId = atVars.texLoaded.id;
        }

        atVars.noteList.clear();

        initializeRunningPerformance(performanceData)
            .then((response) => {
                atVars.texLoaded.performanceId = response.data.performance_id;
            })
            .catch((error) => {
                sheetMusicError(
                    error.response.status,
                    error.response.data,
                    "[vendors/ML5/PitchDetection/actions/pageTurn]"
                );
            });
    } else {
        let performanceData = {
            performanceData: JSON.stringify(
                JSON.parse(JSON.stringify(atVars.noteList.performanceData))
            ),
            performanceId: atVars.texLoaded.performanceId,
            sheetMusicId,
        };
        atVars.noteList.clear();

        updateRunningPerformance(performanceData).catch((error) => {
            sheetMusicError(
                error.response.status,
                error.response.data,
                "[vendors/ML5/PitchDetection/actions/pageTurn]"
            );
        });
    }
};

/**
 * Watches the music and turns the page when the performer is close to the end of the current page.
 * @param {number} currentSectionIndex The starting section index
 * @param {number} currentCount The starting time position
 */
const pageWatch = (currentSectionIndex, currentCount) => {
    let intervalId = setInterval(() => {
        if (
            atVars.texLoaded !== null &&
            atVars.texLoaded.lengthsPerSection !== null
        ) {
            let increment =
                atVars.texLoaded.lengthsPerSection[currentSectionIndex];

            if (
                atVars.api.timePosition / 1000 > currentCount + increment &&
                currentSectionIndex <
                    atVars.texLoaded.lengthsPerSection.length - 1
            ) {
                if (isPitchDetectionAvailable()) {
                    pageTurn();
                }

                atVars.shouldResetDrawPositions = true;
                atVars.p5Obj.clear();
                atVars.api.settings.display.startBar =
                    atVars.api.settings.display.startBar + atVars.barCount - 1;
                atVars.api.updateSettings();
                atVars.api.render();
                currentCount += increment;
                currentSectionIndex++;
            }

            if (atVars.playerState !== playerStates.PLAYING) {
                clearInterval(intervalId);
            }
        }
    }, 100);
};

/**
 * Listens to the singer updating the stored performance information and drawing real time feedback
 */
export const listen = () => {
    if (atVars.playerState === 1) {
        // Player is playing
        if (isPitchDetectionAvailable()) {
            // Start pitch detection
            ptVars.pitchDetectionModel
                .getPitch()
                .then((frequency) => {
                    displayMidi(frequency);
                    listen();
                })
                .catch((error) => {
                    sheetMusicError(
                        null,
                        error,
                        "[vendors/ML5/PitchDetection/actions/listen]"
                    );
                    displayMidi(0);
                    listen();
                });
        }
    }
};

/**
 * Displays the frequency as a midi value on the piece of music
 * @param {number} frequency The frequency to convert and display
 */
export const displayMidi = (frequency) => {
    if (frequency) {
        // Converts frequency to midi value
        let midiNum = (Math.log(frequency / 440) / Math.log(2)) * 12 + 69;
        if (atVars.noteList !== null) {
            atVars.noteList.addNote(midiNum, atVars.api.timePosition / 1000);
        }
        if (atVars.drawer !== null) {
            atVars.drawer.updateNote(atVars.noteList.average);
        }
    } else {
        // Sentinel value of 0 used for silence
        if (atVars.noteList !== null) {
            atVars.noteList.addNote(0, atVars.api.timePosition / 1000);
        }
        if (atVars.drawer !== null) {
            atVars.drawer.updateNote(atVars.noteList.average);
        }
    }
};

/**
 * Stops the pitch detection
 * @param {string} sheetMusicId The id of the sheet music to submit the performance
 */
export const stopPitchDetection = async (sheetMusicId) => {
    if (isPitchDetectionAvailable()) {
        if (atVars.getsFeedback) {
            atVars.p5Obj.noLoop();
        }

        let performanceData = {
            performanceData: JSON.stringify(
                JSON.parse(JSON.stringify(atVars.noteList.performanceData))
            ),
            sheetMusicId,
            exerciseId: null,
            measureStart: atVars.texLoaded.measureStart,
            measureEnd: atVars.texLoaded.measureEnd,
            isDurationExercise: false,
        };
        if (
            atVars.texLoaded.typeOfTex === "Exercise" &&
            atVars.texLoaded.id !== null
        ) {
            performanceData.exerciseId = atVars.texLoaded.id;
        }

        atVars.noteList.clear();

        if (atVars.texLoaded.performanceId !== null) {
            performanceData.performanceId = atVars.texLoaded.performanceId;

            const currentPerformanceId = atVars.texLoaded.performanceId;

            closeRunningPerformance(performanceData)
                .then((response) => {
                    if (
                        atVars.texLoaded.performanceId === currentPerformanceId
                    ) {
                        atVars.texLoaded.performanceId = null;
                    }
                })
                .catch((error) => {
                    sheetMusicError(
                        error.response.status,
                        error.response.data,
                        "[vendors/ML5/PitchDetection/actions/stopPitchDetection]"
                    );
                });
        } else {
            try {
                await addPerformance(performanceData);
            } catch (error) {
                sheetMusicError(
                    error.response.status,
                    error.response.data,
                    "[vendors/ML5/PitchDetection/actions/stopPitchDetection]"
                );
            }
        }
    }
};
