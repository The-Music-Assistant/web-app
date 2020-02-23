class ExerciseGeneration {
    static setUpSheetMusic(input) {
        let sheetMusic = JSON.parse(input);
        return sheetMusic;
    }
    
    static getExercise(performance, trackIndex, staffIndex, startMeasure, endMeasure, expectedPerformance) {
        expectedPerformance = 
        [
            [2.857142857142857,-1,0], 
            [1.4285714285714286,-1,0],
            [0.7142857142857143,50,1],
            [0.7142857142857143,52,1],
            [2.142857142857143,55,1],
            [0.35714285714285715,55,2],
            [0.35714285714285715,57,2],
            [2.142857142857143,59,2],
            [0.35714285714285715,59,2],
            [0.35714285714285715,-1,2],
            [0.7142857142857143,59,3],
            [0.7142857142857143,57,3],
            [2.857142857142857,55,3],
            [0.35714285714285715,52,4],
            [0.35714285714285715,50,4],
            [2.142857142857143,50,4],
            [0.35714285714285715,50,4],
            [0.35714285714285715,-1,4],
            [0.7142857142857143,50,5],
            [0.7142857142857143,52,5],
            [2.142857142857143,55,5],
            [0.35714285714285715,55,6],
            [0.35714285714285715,57,6],
            [1.4285714285714286,59,6],
            [1.4285714285714286,57,6],
            [2.857142857142857,55,7],
            [1.3636363636363635,55,7],
            [1.3636363636363635,-1,8]
            ];
        performance = {
            "pitches":[
            {"duration":2.857142857142857,"midiValue":-1},
            {"duration":1.4285714285714286,"midiValue":-1},
            {"duration":0.7142857142857143,"midiValue":50},
            {"duration":0.7142857142857143,"midiValue":52},
            {"duration":2.142857142857143,"midiValue":55},
            {"duration":0.35714285714285715,"midiValue":55},
            {"duration":0.35714285714285715,"midiValue":57},
            {"duration":2.142857142857143,"midiValue":59},
            {"duration":0.35714285714285715,"midiValue":59},
            {"duration":0.35714285714285715,"midiValue":-1},
            {"duration":0.7142857142857143,"midiValue":59},
            {"duration":0.7142857142857143,"midiValue":57},
            {"duration":2.857142857142857,"midiValue":55},
            {"duration":0.35714285714285715,"midiValue":52},
            {"duration":0.35714285714285715,"midiValue":50},
            {"duration":2.142857142857143,"midiValue":50},
            {"duration":0.35714285714285715,"midiValue":50},
            {"duration":0.35714285714285715,"midiValue":-1},
            {"duration":0.7142857142857143,"midiValue":50},
            {"duration":0.7142857142857143,"midiValue":52},
            {"duration":2.142857142857143,"midiValue":55},
            {"duration":0.35714285714285715,"midiValue":55},
            {"duration":0.35714285714285715,"midiValue":57},
            {"duration":1.4285714285714286,"midiValue":59},
            {"duration":1.4285714285714286,"midiValue":57},
            {"duration":2.857142857142857,"midiValue":55},
            {"duration":1.3636363636363635,"midiValue":55},
            {"duration":1.3636363636363635,"midiValue":-1}
            ]};
            performance = {
            "pitches": [{"duration":0,"midiValue":-1}]
        };
        //console.log(expectedPerformance.pitches.length);
        let measureErrors = [];
        for (let measure = startMeasure; measure <= endMeasure; measure++) {
            measureErrors.push([0, 0, 0, 0, measure]); //Duration, Pitch, Subsequent Bad, Overall score
        }
        let performedNoteIndex = 0;
        for (let noteIndex = 0; noteIndex < expectedPerformance.length; noteIndex++) {
            if (expectedPerformance[noteIndex][2] > endMeasure) {
                break;
            }
            let expectedMIDI = expectedPerformance[noteIndex][1];
            let expectedDuration = expectedPerformance[noteIndex][0];
            let performedDuration = 0;
    
            let comparisonNotes = [];
            let performedMIDI = 0;
            let longestComparisonNote = [-1, 0];
    
            let shortestExpectedNote = 0.16;
            let wiggleRoom = shortestExpectedNote / 2.0;
            while ((expectedDuration - performedDuration) > wiggleRoom && (performedNoteIndex < performance.pitches.length)) {
                let performedNote = performance.pitches[performedNoteIndex];
                if ((performedDuration + performedNote["duration"]) > (expectedDuration + wiggleRoom)) {
                    comparisonNotes.push([(performedDuration + performedNote["duration"]) - (expectedDuration + wiggleRoom), performedNote["midiValue"]]); //VERIFY
                    performedDuration = expectedDuration + wiggleRoom;
                } else {
                    performedNoteIndex++;
                    performedDuration += performedNote["duration"];
                    comparisonNotes.push([performedNote["duration"], performedNote["midiValue"]]);
                }
                if (performedNote["duration"] > longestComparisonNote[1]) {
                    longestComparisonNote = [performedNote["duration"], performedNote["midiValue"]];
                }
            }
            if (performedDuration === 0) {
                performedDuration = -1; //The performance was shorter than expected
            }
            let heldDuration = 0;
            for (let i = 0; i < comparisonNotes.length; i++) {
                performedMIDI += comparisonNotes[i][0] * comparisonNotes[i][1]; //Averaging the MIDI value held over the duration of this note
                if (comparisonNotes[i][1] === longestComparisonNote[1]) {
                    heldDuration += comparisonNotes[i][0];
                }
            }
            let durationDifference = (heldDuration - expectedDuration)*(heldDuration - expectedDuration)/(expectedDuration);
            let ignoreDurationDifferencesBelowThisValue = 0;
            if (durationDifference <  ignoreDurationDifferencesBelowThisValue) {
                durationDifference = 0;
            }
            let pitchDifference = (performedMIDI - expectedMIDI * expectedDuration)*(performedMIDI - expectedMIDI * expectedDuration)/(expectedMIDI * expectedDuration);
            //Update the measure errors
            let thisNotesMeasure = expectedPerformance[noteIndex][2];
            measureErrors[thisNotesMeasure][0] += durationDifference;
            measureErrors[thisNotesMeasure][1] += pitchDifference;
            measureErrors[thisNotesMeasure][3] += (durationDifference + 1) * pitchDifference;
        }
        
        for (let i = 0; i < measureErrors.length - 1; i++) {
            for (let j = i; j < measureErrors.length; j++) {
                measureErrors[i][2] = j - i;
                if (measureErrors[j][1] <= measureErrors[i][1]) {
                    break;
                }
            }
            console.log(measureErrors[i]);
        }
    }
}

export default ExerciseGeneration;
