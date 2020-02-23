import ml5 from "ml5";
import p5 from "./sketch";
import AlphaTabRunner from "./AlphaTabRunner";

class PitchDetection {
    audioContext;
    micStream;
    pitchDetectionModel;
    label;
    noteList;

    /**
     * Sets up pitch detection
     */
    static setupPitchDetection() {
        return new Promise((resolve, reject) => {
            // Create AudioContext instance
            this.audioContext = new AudioContext();

            // Starts microphone stream if available
            if (navigator.mediaDevices) {
                navigator.mediaDevices
                    .getUserMedia({ audio: true })
                    .then(micStream => {
                        this.micStream = micStream;

                        // Sets up ML5 pitch detection
                        this.ml5Setup()
                            .then(model => {
                                this.pitchDetectionModel = model;
                                resolve();
                            })
                            .catch(err => {
                                reject(`[error][PitchDetection] ${err}`);
                            });
                    })
                    .catch(err => {
                        reject();
                    });
            } else {
                reject("[warning][PitchDetection] Cannot access microphone");
            }
        });
    }

    /**
     * Sets up ML5 pitch detection
     */
    static ml5Setup() {
        // Label element to display frequency
        this.label = document.querySelector("#frequency");

        // Creates pitch detection model
        return ml5.pitchDetection("./Pitch-Detection-Model/", this.audioContext, this.micStream).ready;
    }

    /**
     * Continuously detects pitch and displays it on the screen
     * @returns The id of the current setInterval process (this can be used to stop the current setInterval process)
     */
    static startPitchDetection(fileName) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://127.0.0.1:5000/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send("play " + fileName);

        AlphaTabRunner.noteList.clear();
        let count = 0;
        let increment = 3 * (60/56)*29
        // Run nested anonymous function every 1 ms
        return setInterval(() => {
            // console.log("time", AlphaTabRunner.api.timePosition, "tick", AlphaTabRunner.api.tickPosition);
            if (AlphaTabRunner.api.timePosition / 1000 > count + increment) {
                console.log("time", AlphaTabRunner.api.timePosition, "tick", AlphaTabRunner.api.tickPosition);
                AlphaTabRunner.api.settings.display.startBar = AlphaTabRunner.api.settings.display.startBar + 28;
                AlphaTabRunner.api.updateSettings();
                AlphaTabRunner.api.render();
                count += increment;
            }
            p5.redraw();
            // Gets the current pitch and sends it to displayMidi
            this.pitchDetectionModel.getPitch().then(frequency => {
                this.displayMidi(frequency);
            }).catch(err => {
                console.log(`[error][PitchDetection] ${err}`);
                this.displayMidi(0);
            });
        }, 1);
    }

    /**
     * Displays the frequency as a midi value on the piece of music
     * @param {number} frequency The frequency to convert and display
     */
    static displayMidi(frequency) {
        if (frequency) {
            // Converts frequency to midi value
            let midiNum = (Math.log(frequency / 440) / Math.log(2)) * 12 + 69;
            
            AlphaTabRunner.noteList.addNote(midiNum, AlphaTabRunner.api.timePosition / 1000);
            AlphaTabRunner.drawer.updateNote(AlphaTabRunner.noteList.average);
        } else {
            // Sentinel value of 0 used for silence
            AlphaTabRunner.noteList.addNote(0, AlphaTabRunner.api.timePosition / 1000);
            AlphaTabRunner.drawer.updateNote(AlphaTabRunner.noteList.average);
        }
    }

        /**
     * Stops the detection of the pitch
     * @param {number} setIntervalID The id of the setInterval process to stop
     */
    static stopPitchDetection(setIntervalID) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://127.0.0.1:5000/', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(JSON.stringify(AlphaTabRunner.noteList.performanceData))
        //xhr.send("stop");
        clearInterval(setIntervalID);
        //console.log(JSON.stringify(AlphaTabRunner.noteList.performanceData));
        console.log(JSON.parse(this.sheetMusic));
        //this.getExercise(AlphaTabRunner.noteList.performanceData, 0, 0, this.sheetMusic);
    }
    
    static setUpSheetMusic(input) {
        let sheetMusic = JSON.parse(input);
        return sheetMusic;
    }
    /*
    static getExpectedPerformance(sheetMusic, trackIndex, staffIndex, startMeasure, endMeasure) {
        let expectedPerformance = [];
        for (let i = 0; i < sheetMusic["measures"].length; i++) {
            let chord = sheetMusic["measures"][i];
            [[duration, midi, measure]]
        }
        return expected;
    }
    */
    static getExercise(performance, trackIndex, staffIndex, startMeasure, endMeasure, sheetMusic) {
        let fakeSheetMusic = 
        {"measures": [
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {"tsTop": 6, "tsBottom": 8}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 60, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 67, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 69, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 74, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": ["crescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 69, "beatEffects": ["dotted", "crescendo"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 64, "beatEffects": ["decrescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 74, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 77, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 77, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 72, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": ["crescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 69, "beatEffects": ["dotted", "crescendo"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 64, "beatEffects": ["decrescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 60, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 67, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 77, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 69, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 67, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 69, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 65, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 67, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 62, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 64, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted", "crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": ["crescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 69, "beatEffects": ["dotted", "crescendo"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted", "decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 64, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 64, "beatEffects": ["decrescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 62, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 62, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 74, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 72, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted", "crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": ["crescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": ["crescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": 69, "beatEffects": ["dotted", "crescendo"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 67, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 65, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 64, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 60, "beatEffects": ["decrescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 62, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 60, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 67, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 74, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 77, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.6071428571428572, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 3.2142857142857144, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 69, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 70, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 69, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 77, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 77, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 76, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 72, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 72, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.8035714285714286, "midiValue": 70, "beatEffects": ["dotted", "decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.26785714285714285, "midiValue": 72, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 74, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 72, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": ["decrescendo"], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 70, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": ["decrescendo"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 67, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 67, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 69, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 69, "beatEffects": ["tied"], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": -1, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 65, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": 70, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 69, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": [
                {"pitches": {"duration": 1.6071428571428572, "midiValue": 67, "beatEffects": ["dotted"], "noteEffects": []}}, 
                {"pitches": {"duration": 1.0714285714285714, "midiValue": -1, "beatEffects": [], "noteEffects": []}}, 
                {"pitches": {"duration": 0.5357142857142857, "midiValue": 65, "beatEffects": [], "noteEffects": []}}], "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 4.5, "midiValue": 65, "beatEffects": ["dotted", "decrescendo"], "noteEffects": []}}, "attributesInt": {"tempo": 40}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 4.5, "midiValue": 65, "beatEffects": ["tied", "dotted", "decrescendo"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 4.5, "midiValue": 65, "beatEffects": ["tied", "dotted", "decrescendo"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}, 
            {"chords": 
                {"pitches": {"duration": 4.5, "midiValue": -1, "beatEffects": ["dotted"], "noteEffects": []}}, "attributesInt": {}, "attributesStr": {}}
            ], "keySignature": "F"};
        let expectedPerformance = this.getExpectedPerformance(fakeSheetMusic, trackIndex, staffIndex, startMeasure, endMeasure);
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
        console.log(expectedPerformance.pitches.length);
        let measureErrors = [];
        for (let measure = startMeasure; measure < endMeasure; measure++) {
            measureErrors.push([0, 0, 0, measure, 0]); //Duration, Pitch, Subsequent Bad, Overall score
        }
        let performedNoteIndex = 0;
        for (let noteIndex = 0; noteIndex < expectedPerformance.pitches.length; noteIndex++) {
            let expectedMIDI = expectedPerformance.pitches[noteIndex]["midiValue"];
            let expectedDuration = expectedPerformance.pitches[noteIndex]["duration"];
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
                    comparisonNotes.push(performedNote);
                }
                if (performedNote[0] > longestComparisonNote[0]) {
                    longestComparisonNote = [performedNote["duration"], performedNote["midiValue"]];
                }
            }
            if (performedDuration == 0) {
                performedDuration = -1; //The performance was shorter than expected
            }
            let heldDuration = 0;
            for (let i = 0; i < comparisonNotes.length; i++) {
                performedMIDI += comparisonNotes[i][0] * comparisonNotes[i][1]; //Averaging the MIDI value held over the duration of this note
                if (comparisonNotes[i][1] == longestComparisonNote[1]) {
                    heldDuration += comparisonNotes[i][0];
                }
            }

            let durationDifference = (heldDuration - expectedDuration)*(heldDuration - expectedDuration)/(expectedDuration);
            let ignoreDurationDifferencesBelowThisValue = 0;
            if (durationDifference <  ignoreDurationDifferencesBelowThisValue) {
                durationDifference = 0;
            }
            let pitchDifference = (performedMIDI - expectedMIDI)*(performedMIDI - expectedMIDI)/(expectedMIDI);

            //Update the measure errors
            let thisNotesMeasure = expectedPerformance.pitches[noteIndex][2];
            measureErrors[thisNotesMeasure][0] += durationDifference;
            measureErrors[thisNotesMeasure][1] += pitchDifference;
            measureErrors[thisNotesMeasure][3] += (durationDifference + 1) * pitchDifference;
        }
        for (let i = 0; i < measureErrors.length - 1; i++) {
            for (let j = i; j < measureErrors.length; j++) {
                if (measureErrors[j][1] < measureErrors[i][1]) {
                    break;
                }
                measureErrors[i][2] = j - i;
            }
            console.log(measureErrors[i]);
        }
    }
}

export default PitchDetection;
