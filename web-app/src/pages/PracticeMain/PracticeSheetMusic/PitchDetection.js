import ml5 from "ml5";
import p5 from "./sketch";
import AlphaTabRunner from "./AlphaTabRunner";
import WebWorker from "./WebWorker";
// import Worker from 'worker-loader!./worker.js';
import worker from "./worker";

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
        // let xhr = new XMLHttpRequest();
        // xhr.open("POST", 'http://localhost:1234', true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.send(JSON.stringify({"fileName":fileName}));

        AlphaTabRunner.noteList.clear();
        // Run nested anonymous function every 1 ms
        // return setInterval(() => {
        //     p5.redraw();
        //     // Gets the current pitch and sends it to displayMidi
        //     this.pitchDetectionModel.getPitch().then(frequency => {
        //         this.displayMidi(frequency);
        //     }).catch(err => {
        //         console.log(`[error][PitchDetection] ${err}`);
        //         this.displayMidi(0);
        //     });
        // }, 1);
    
        // let myWorker = new WebWorker(`() => { 
        //     const fib = i => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

        //     self.addEventListener('message', e => {
        //         self.importScripts("PitchDetection.js");
        //         const count = e.data;
        //         postMessage(fib(7));
        //     });
        // }`);
        let myWorker = new WebWorker(worker);
        myWorker.addEventListener('message', event => {
            console.log(event.data);
        });
        myWorker.postMessage(7);

        

    }

    static animateDrawing() {
        p5.redraw();
        // Gets the current pitch and sends it to displayMidi
        this.pitchDetectionModel.getPitch().then(frequency => {
            this.displayMidi(frequency);
        }).catch(err => {
            console.log(`[error][PitchDetection] ${err}`);
            this.displayMidi(0);
        });
    }

    /**
     * Stops the detection of the pitch
     * @param {number} setIntervalID The id of the setInterval process to stop
     */
    static stopPitchDetection(setIntervalID) {
        clearInterval(setIntervalID);
        // let xhr = new XMLHttpRequest();
        // xhr.open("POST", 'http://3.18.108.127:2765', true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // console.log(JSON.stringify(AlphaTabRunner.noteList.performanceData));
        // xhr.send(JSON.stringify(AlphaTabRunner.noteList.performanceData));
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
}

export default PitchDetection;
