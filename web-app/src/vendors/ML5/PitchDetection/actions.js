// ----------------------------------------------------------------------------
// File Path: src/vendors/ML5/PitchDetection/actions.js
// Description: Pitch detection actions
// Author: Dan Levy & Daniel Griessler
// Email: danlevy124@gmail.com & dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

// File imports
import atVars from "../../AlphaTab/variables";
import ptVars from "./variables";
import {
    initializeRunningPerformance,
    updateRunningPerformance,
    addPerformance,
    closeRunningPerformance
} from "../../../App/musicAssistantApi";
import { sheetMusicError } from "../../Firebase/logs";

/**
 * Continuously detects pitch and displays it on the screen
 * @returns The id of the current setInterval process (this can be used to stop the current setInterval process)
 */
export const startPitchDetection = () => {
    atVars.texLoaded.performanceId = null;
    atVars.noteList.clear();
    if (atVars.getsFeedback) {
        atVars.p5Obj.loop();
    }
    listen(0, 0);
};

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
            isDurationExercise: false
        };
        if (atVars.texLoaded.typeOfTex === "Exercise" && atVars.texLoaded.id !== null) {
            performanceData.exerciseId = atVars.texLoaded.id;
        }

        atVars.noteList.clear();

        initializeRunningPerformance(performanceData)
            .then(response => {
                atVars.texLoaded.performanceId = response.data.performance_id;
            })
            .catch(error => {
                sheetMusicError(
                    error.response.status,
                    error.response.data,
                    "[PitchDetection/pageTurn]"
                );
            });
    } else {
        let performanceData = {
            performanceData: JSON.stringify(
                JSON.parse(JSON.stringify(atVars.noteList.performanceData))
            ),
            performanceId: atVars.texLoaded.performanceId,
            sheetMusicId
        };
        atVars.noteList.clear();

        updateRunningPerformance(performanceData).catch(error => {
            sheetMusicError(
                error.response.status,
                error.response.data,
                "[PitchDetection/pageTurn]"
            );
        });
    }
};

export const listen = (currentSectionIndex, currentCount) => {
    let increment = null;
    if (atVars.texLoaded !== null && atVars.texLoaded.lengthsPerSection !== null) {
        increment = atVars.texLoaded.lengthsPerSection[currentSectionIndex];

        if (atVars.api.timePosition / 1000 > currentCount + increment) {
            pageTurn();

            atVars.shouldResetDrawPositions = true;
            atVars.p5Obj.clear();
            atVars.api.settings.display.startBar =
                atVars.api.settings.display.startBar + atVars.barCount - 1;
            atVars.api.updateSettings();
            atVars.api.render();
            currentCount += increment;
        }
    }

    if (atVars.playerState === 1) {
        ptVars.pitchDetectionModel
            .getPitch()
            .then(frequency => {
                displayMidi(frequency);
                listen(currentSectionIndex, currentCount);
            })
            .catch(error => {
                sheetMusicError(null, error, "[PitchDetection/listen]");
                displayMidi(0);
                listen(currentSectionIndex, currentCount);
            });

        try {
            const topLine = document.getElementById("rect_0");
            const nextLine = document.getElementById("rect_1");
            const topLineHeight = topLine.y.animVal.value;
            const distanceBetweenLines = nextLine.y.animVal.value - topLineHeight;
            if (
                topLineHeight !== atVars.drawer.topLine ||
                distanceBetweenLines !== atVars.drawer.distanceBetweenLines
            ) {
                atVars.drawer.setTopLineAndDistanceBetween(
                    topLineHeight,
                    distanceBetweenLines,
                    atVars.drawer.baseOctave
                );
            }
        } catch (error) {
            sheetMusicError(null, error, "[PitchDetection/listen]");
        }
    }
};

/**
 * Displays the frequency as a midi value on the piece of music
 * @param {number} frequency The frequency to convert and display
 */
export const displayMidi = frequency => {
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
export const stopPitchDetection = async sheetMusicId => {
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
        isDurationExercise: false
    };
    if (atVars.texLoaded.typeOfTex === "Exercise" && atVars.texLoaded.id !== null) {
        performanceData.exerciseId = atVars.texLoaded.id;
    }

    atVars.noteList.clear();

    if (atVars.texLoaded.performanceId !== null) {
        performanceData.performanceId = atVars.texLoaded.performanceId;

        const currentPerformanceId = atVars.texLoaded.performanceId;

        closeRunningPerformance(performanceData)
            .then(response => {
                if (atVars.texLoaded.performanceId === currentPerformanceId) {
                    atVars.texLoaded.performanceId = null;
                }
            })
            .catch(error => {
                sheetMusicError(
                    error.response.status,
                    error.response.data,
                    "[PitchDetection/stopPitchDetection]"
                );
            });
    } else {
        await addPerformance(performanceData);
    }
};
