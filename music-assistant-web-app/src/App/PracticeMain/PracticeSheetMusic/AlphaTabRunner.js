// https://docs.alphatab.net/develop/  for development Documentation

import player from "./default.sf2";
import PitchDetection from "./PitchDetection";
import p5 from "./sketch";
import Drawer from "./Drawer";
import NoteList from "./NoteList";

/**
 * Runs AlphaTab including initialization and keeping a Drawer and NoteList instance
 */
class AlphaTabRunner {
    api;
    intervalID;
    drawer;
    noteList;

    /**
     * Initializes the AlphaTab API
     * Displays the piece of music on the screen
     */
    static initializeAPI() {
        // TODO: Pull from database on last loaded tracks
        // Specifies what tracks to render on load
        this.currentTrackIndexes = [];

        // AlphaTab API settings
        let settings = {
            player: player,
            cursor: true,
            layout: "horizontal",
            scrollElement: "#wrapper"
        };

        // Creates the AlphaTab API
        this.api = new window.alphaTab.platform.javaScript.AlphaTabApi(
            document.querySelector("#alpha-tab-container"),
            settings
        );

        this.loadTex();

        // Listener is executed when AlphaTab is rendered on the screen
        this.api.addPostRenderFinished(() => {
            this.alphaTabRenderFinished();
        });

        // Listener is executed when the player state changes (e.g. play, pause, and stop)
        this.api.addPlayerStateChanged(() => {
            this.alphaTabPlayerStateChanged();
        });
    }

    /**
     * Run when AlphaTab is rendered on the screen
     * TODO: Fix so that it updates the variables on subsequent alphaTab renders besides the first one
     */
    static alphaTabRenderFinished() {
        // TODO: Get this from the database and base it on what part is being sung for
        // Retrieves staff lines using IDs attacked to elements generated by AlphaTab. Required editing AlphaTab.js directly
        let topLine = document.getElementById("rect_0");
        let nextLine = document.getElementById("rect_1");

        // We were getting an error where rect_0 or rect_1 were null even though AlphaTab said they were rendered
        // This sets up an interval to keep waiting for them to not be null before moving on with the render process
        const lineReadyID = setInterval(() => {
            if (topLine !== null && nextLine !== null) {
                // stop interval from running
                clearInterval(lineReadyID);

                // retrieves the height of the staff lines based on a relative offset to their wrapping contanier
                // used to setup the canvas so the canvas needs to be directly on top of the alphaTab container where these are stored
                const topLineHeight = topLine.y.animVal.value;
                const distanceBetweenLines = nextLine.y.animVal.value - topLineHeight;

                // TODO: Update these values on subsequent renders since we just need to update their bounds
                // Creates a new drawer and noteList
                AlphaTabRunner.drawer = new Drawer(topLineHeight + 1, distanceBetweenLines);
                AlphaTabRunner.noteList = new NoteList(0);

                // TODO: Pull this from database
                AlphaTabRunner.noteList.updateBounds(55, 82);
                
                p5.setup(AlphaTabRunner.drawer);

                // Prepares for microphone input sets up the pitch detection model
                PitchDetection.setupPitchDetection().then(() => {
                    console.log("[info][AlphaTabRunner] Pitch Detection is ready");
                }).catch(err => {
                    console.log(err);
                });
            } else {
                topLine = document.getElementById("rect_0");
                nextLine = document.getElementById("rect_1");
            }
        }, 3);
    }

    static alphaTabPlayerStateChanged() {
        if (AlphaTabRunner.api.playerState !== 1) {
            PitchDetection.stopPitchDetection(this.intervalID);

            // TODO: Set MusicControls state to isPlaying: false so that it changes the button
        } else {
            // Runs the pitch detection model on microphone input and displays it on the screen
            // TODO: Don't show player controls (e.g. play and pause buttons) until AlphaTab and ML5 are ready
            this.intervalID = PitchDetection.startPitchDetection();
        }
    }

    static loadTex() {
        AlphaTabRunner.api.tex(`\\title "Down by the Riverside"
        \\subtitle "Arranged by: Brant Adams. B.M.I."
        \\tempo 84
        .
        
        \\track "Soprano"
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G
        \\lyrics "Oo _ _ _ _ _ _ Oo _ _ _ _ _ _ Oo _ _ _ _ _ _ _ _"
        r.1 |
        r.2 :4 d3 e3 |
        g3{d}.2 :8 g3{-} a3 |
        b3{d}.2 :8 b3{-} r |
        \\ts 2 4 :4 b3 a3 |
        \\ts 4 4 g3.1 |
        :8 e3 d3 d3{- d}.2 :8 d3{-} r |
        \\ts 2 4 :4 d3 e3 |
        \\ts 4 4 g3{d}.2 :8 g3 a3 |
        :2 b3 a3 |
        g3.1 |
        \\tempo 88
        \\ts 4 4 :2 g3{-} r |
        
        \\track "Alto"
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G
        \\lyrics "Oo _ _ _ _ Oo _ _ _ _ _ _ Oo _ _ _ _ Oo _ _ _"
        r.1 |
        r.2 :4 d4 e4 |
        g4.1 |
        g4{- d}.2 :8 g4{-} r |
        \\ts 2 4 f4.2 |
        \\ts 4 4 :2 e4 c4 |
        :8 c4 d4 d4{-}.2 :8 d4{-} r |
        \\ts 2 4 :4 d4 e4 |
        \\ts 4 4 g4{d}.2 e4.4 |
        e4.2 :4 e4 c4 |
        c4.1 |
        \\tempo 88
        \\ts 4 4 :2 b3 r |
        
        \\track "Tenor"
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G \\clef F4
        \\lyrics "Oo _ _ _ Oo _ _"
        :1 r | r | r | r | \\ts 2 4 r.2 | \\ts 4 4 :1 r | r |
        \\ts 2 4 :4 d4 c4 |
        \\ts 4 4 b3.1 |
        :2 g3 a3 |
        ab3.1 |
        \\tempo 88
        \\ts 4 4 :2 g3 r |
        
        \\track "Bass"
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G \\clef F4
        \\lyrics "Oo _ _ _ _ Oo _ _ _"
        :1 r | r | r | r | \\ts 2 4 r.2 | \\ts 4 4 :1 r | r | \\ts 2 4 r.2 |
        \\ts 4 4 :4 g3 f#3 e3 d3 |
        c#3.2 :4 c3 d3 |
        eb3.1 |
        \\tempo 88
        \\ts 4 4 :2 d3 r |
        
        \\track "Piano Upper"
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G
        r.8 d6{d}.4 d6{-}.2 |
        r.8 d6{d}.4 d6{-}.2 |
        r.8 d6{d}.4 d6{-}.2 |
        r.8 :4 d6{d} d6{-} :4 (e6 b6) |
        \\ts 2 4 :4 d5 a4{-} |
        \\ts 4 4 r.8 d6{d}.4 d6{-}.2 |
        r.8 d6{d}.4 d6{-}.2 |
        \\ts 2 4 d6{-}.2 |
        \\ts 4 4 r.8 d6{d}.4 d6{-}.2 |
        r.4 :16 a4 b4 c#5 e5 f#5.4 :16 a4 c5 e5 f#5 |
        g5.4 :16 ab4 bb4 c5 eb5 :8{tu 3} f5 g5 ab5 :8{tu 3} bb5 c6 eb6 |
        \\tempo 88
        \\ts 12 8 (a5{d} b5{d} d6{d}).2 a4{d}.2 |

        \\track "Piano Upper 2"        
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G
        r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
        r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
        r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
        r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
        \\ts 2 4 f4.2 |
        \\ts 4 4 r.8 :16 g5 a5 :8 d5 e5 e5{-}.2 |
        r.8 :16 a5 b5 :8 d5 e5 e5{-} a5 d6.4 |
        \\ts 2 4 d6{-}.2 |
        \\ts 4 4 r.8 :16 g5 a5 :8 f#5 d5 d5{-}.2 |
        r.1 |
        r.1 |
        \\tempo 88
        \\ts 12 8 :8 g2 d3 g3 a3 b3 d4 a4 d4 b3 a3 g3 d3 |
        
        \\track "Piano Lower"
        \\staff {score} \\tuning piano \\instrument acousticgrandpiano \\ks G
        :1 (d4 g4) |
        :1 (d4 g4) |
        :1 (d4 g4) |
        :1 (d4 g4) |
        \\ts 2 4 :2 (d4{-} g4{-}) |
        \\ts 4 4 :1 (e4 g4) |
        :1 (c4 d4 g4) |
        \\ts 2 4 d4.2 |
        \\ts 4 4 :2 (d4 g4) (e4 g4) |
        :16 b3 c#4 e4 g4 g4{-}.4 :16 a3 c4 d4 e4 :8 f#4 d4 |
        :16 ab3 c4 eb4 g4 (ab3{- d} c4{- d} eb4{- d} g4{- d}).2 |
        \\tempo 88
        \\clef F4
        \\ts 12 8 :1 g2{d} |`, [0,1,2,3,4,5,6]);

        let updatedTrackIndexes = [];
        for (let i = 0; i < AlphaTabRunner.api.score.tracks.length; i++) {
            updatedTrackIndexes.push(i);
        }

        AlphaTabRunner.currentTrackIndexes = updatedTrackIndexes;

    }
}

export default AlphaTabRunner;
