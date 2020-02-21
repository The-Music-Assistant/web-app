// ----------------------------------------------------------------------------
// File Path: src/components/PracticeMain/PracticeSheetMusic/sketch.js
// Description: P5 sketch wrapper
// Author: Daniel Griessler
// Email: dgriessler20@gmail.com
// Created Date: 11/15/2019
// ----------------------------------------------------------------------------

import AlphaTabRunner from "./AlphaTabRunner";

/**
 * Wrapper for local p5 setup and draw functions
 * @param {sketch} p Sketch object that will include all of the functions that will be called by p5
 */
const p5Sketch = p => {
    // how much space to add around note for drawing lines, obtained by guess and check
    const EXTRA_BAR_VARIANCE = 7;

    // document elements retrieved from the document
    let barCursor;
    let alphaTabSurface;
    let sideNavElementWidth;

    // wraps together the Alpha tab container and p5's canvas
    let wrapper;

    // provided by reference which is updated in other functions
    let drawer;

    // reference to p5's canvas when created. It should overlay the AlphaTab canvas
    let canvas;

    // how large to draw the notehead
    // TODO: Dynamically change based on scale of music
    let circleSize = 10;

    // stores last two XY coordinates of notes drawn
    let previousPos = [-1, -1, -1, -1];

    // stores the last recorded midi value and its time
    let lastPitchAndTime = [-1, -1];

    const STATE_SHEET_MUSIC = 1;
    const STATE_HIGHLIGHT = 2;
    let state = STATE_SHEET_MUSIC;

    let latestDrawnMeasure = -1;
    let latestBase = 0;
    let musicSections = [];
    let currentMusicSection = null;

    /**
     * This function is called twice. Once, upon initialization p5 calls it which we use to tell p5 to stop looping
     * Then, AlphaTab will call setup when its done being rendered. Then, the canvas can be setup for drawing since
     * the canvas overlays the AlphaTab container
     * TODO: Ensure that the canvas can resize when AlphaTab rerenders, use resizeCanvas
     * @param {Drawer} drawerGiven p5 will not provide this but AlphaTabRunner provides a reference to the Drawer being used
     */
    p.setup = function(drawerGiven) {
        if (drawerGiven === undefined) {
            p.noLoop();
            return;
        }
        drawer = drawerGiven;
        // Retrieved by attaching unique IDs to elements generated by AlphaTab. Required editing AlphaTab.js directly
        barCursor = document.getElementById("bC");
        alphaTabSurface = document.getElementById("aTS");
        const sideNavElement = document.querySelector("#side-nav");
        sideNavElementWidth = sideNavElement !== null ? sideNavElement.clientWidth : 0;
        wrapper = document.getElementById("wrapper");

        // creates a canvas that overlaps the alphaTabSurface. Position is absolute for the canvas by default
        canvas = p.createCanvas(alphaTabSurface.clientWidth, alphaTabSurface.clientHeight);
        const x = 0;
        const y = 0;
        canvas.position(x, y);
        canvas.parent("sketch-holder");
    };

    /**
     * Draws the canvas on the screen. Requires that the canvas is not undefined ie setup has run
     * TODO: Handle sheet music scale
     */
    p.draw = function() {
        
        // This does the highlighting of the measures
        // The currently upcommented code draws over the first measure
        // Expand the use of the measurePositions to draw the rest of the measures, add watcher for scroller to automatically update for measureSeparator or otherwise just check for more that haven't been drawn

        if (AlphaTabRunner && AlphaTabRunner.highlightMeasures) {
            if (state === STATE_SHEET_MUSIC) {
                state = STATE_HIGHLIGHT;
                p.clear();
            }
            let measurePositions = document.getElementById("aTS").getElementsByClassName("measureSeparator");
            p.fill(0, 255, 0);

            // use the ratio of tickposition to timeposition to get time bounds and convert to measure bounds for exercise selection
            // console.log(AlphaTabRunner.api.playbackRange, AlphaTabRunner.api.tickPosition, AlphaTabRunner.api.timePosition)
            // AlphaTabRunner.api.timePosition = 32086.56093388224790436982292545

            if (latestDrawnMeasure === -1) {
                // draws highlight on first measure
                let firstBarPos = AlphaTabRunner.texLoaded.firstBarMeasurePosition;
                let pos1X = firstBarPos.left;
                let pos1Y = firstBarPos.top + drawer.distanceBetweenLines; 
                let pos2X = measurePositions[0].x.baseVal.value;
                p.rect(pos1X, pos1Y, pos2X-pos1X, drawer.distanceBetweenLines*4);
                if (!isNaN(pos1X)) {
                    latestDrawnMeasure++;
                    currentMusicSection = {
                        startMeasure: 1,
                        endMeasure: 1,
                        base: 0 
                    };
                } else {
                    AlphaTabRunner.api.timePosition = 0;
                    AlphaTabRunner.texLoaded.firstBarMeasurePosition = {
                        left: parseInt(barCursor.style.left.substring(0,barCursor.style.left.length - 2), 10),
                        top: parseInt(barCursor.style.top.substring(0,barCursor.style.left.length - 2), 10),
                        width: parseInt(barCursor.style.width.substring(0,barCursor.style.left.length - 2), 10),
                        height: parseInt(barCursor.style.height.substring(0,barCursor.style.left.length - 2),10)
                    };
                }
            } else {
                // draws height of later measures only drawing new measures
                while (latestDrawnMeasure < measurePositions.length - 1) {
                    let pos1X = measurePositions[latestDrawnMeasure].x.baseVal.value + latestBase;
                    let pos1Y = measurePositions[latestDrawnMeasure].y.baseVal.value; 
                    latestDrawnMeasure++;
                    if (!measurePositions[latestDrawnMeasure-1].parentNode.isSameNode(measurePositions[latestDrawnMeasure].parentNode)) {
                        currentMusicSection.endMeasure = latestDrawnMeasure;
                        const newSection = JSON.parse(JSON.stringify(currentMusicSection))
                        musicSections.push(newSection);
                        latestBase = latestBase + measurePositions[latestDrawnMeasure-1].x.baseVal.value + 1;
                        currentMusicSection.startMeasure = latestDrawnMeasure;
                        currentMusicSection.base = latestBase;
                    }
                    let dist = Math.abs(measurePositions[latestDrawnMeasure].x.baseVal.value + latestBase - pos1X);
                    p.rect(pos1X, pos1Y, dist, drawer.distanceBetweenLines*4);   
                }
            }
            return;
        } else if (state === STATE_HIGHLIGHT) {          
            p.clear();
            latestDrawnMeasure = -1;
            latestBase = 0;
            musicSections.length = 0;
            currentMusicSection = null;
            state = STATE_SHEET_MUSIC;
            return;
        }
        // handles clearing ahead and drawing line behind the note head
        if (previousPos[0] !== -1 && previousPos[1] !== -1) {
            // fills with white
            p.fill("#F8F8F8");

            // draws clearing rectangle with total height of alpha tab from previous X position to the end
            p.rect(
                previousPos[0],
                30,
                alphaTabSurface.clientWidth - previousPos[0],
                alphaTabSurface.clientHeight - 30
            );

            // don't draw silence which has special value -1 or if we don't have a previous point
            if (
                drawer &&
                drawer.note.midiVal >= 0 &&
                previousPos[2] !== -1 &&
                previousPos[3] !== -1
            ) {
                if (AlphaTabRunner.noteStream[AlphaTabRunner.noteStreamIndex] === -1) {
                    // singing should be silent
                    p.stroke(255, 0, 0);
                } else {
                    let diff = Math.abs(
                        lastPitchAndTime[0] - AlphaTabRunner.noteStream[AlphaTabRunner.noteStreamIndex]
                    );

                    // fill with green if really close
                    if (diff < 1) {
                        p.stroke(0, 255, 0);
                    } else if (diff < 2) {
                        // yellow if farther away
                        p.stroke("#CCCC00");
                    } else {
                        // and red if too far or singing when should be silent
                        p.stroke(255, 0, 0);
                    }
                }

                p.strokeWeight(3);
                p.line(previousPos[0], previousPos[1], previousPos[2], previousPos[3]);
                p.noStroke();
            }
            previousPos[2] = previousPos[0];
            previousPos[3] = previousPos[1];
        }

        // dont draw the outline of the shape, note: you need to turn stroke on to draw lines as we do below.
        p.noStroke();

        if (drawer) {
            lastPitchAndTime[0] = drawer.note.midiVal;
            lastPitchAndTime[1] = AlphaTabRunner.api.timePosition / 1000;
            while (
                lastPitchAndTime[1] >
                AlphaTabRunner.cumulativeTime +
                    AlphaTabRunner.noteStream[AlphaTabRunner.noteStreamIndex + 1]
            ) {
                AlphaTabRunner.cumulativeTime +=
                    AlphaTabRunner.noteStream[AlphaTabRunner.noteStreamIndex + 1];
                AlphaTabRunner.noteStreamIndex += 2;
            }

            let currentHeight = drawer.noteHeight;
            previousPos[1] = currentHeight;

            // fills with pink
            p.fill(255, 0, 255);

            // Binds x position to the bar cursor
            let posX =
                barCursor.getClientRects()[0].left.valueOf() -
                sideNavElementWidth +
                wrapper.scrollLeft;

            // TODO: Handle resizing scale
            // places sharp if present beside the note. These magic values were calculated via trial and error
            let sharpPos = [posX - 14, currentHeight + 3.5];
            previousPos[0] = sharpPos[0] - EXTRA_BAR_VARIANCE;

            // silence has Sentinel value -1 so only draw when not silent
            if (drawer.note.midiVal >= 0) {
                // actually draws note circle at the given position
                p.ellipse(posX, currentHeight, circleSize, circleSize);

                // TODO Handle resizing scale
                // Adds sharp symbol if needed
                if (drawer.note.isSharp) {
                    p.text("#", sharpPos[0], sharpPos[1]);
                }

                // Adds ledger lines above or below the staff
                if (drawer.belowOrAbove !== 0) {
                    let isIncreasing = drawer.belowOrAbove > 0;
                    p.stroke(0);
                    p.strokeWeight(1);
                    let height = isIncreasing
                        ? drawer.topLine
                        : drawer.firstLine - drawer.distanceBetweenLines;
                    for (let i = 0; i < Math.abs(drawer.belowOrAbove); i++) {
                        if (isIncreasing) {
                            height -= drawer.distanceBetweenLines;
                        } else {
                            height += drawer.distanceBetweenLines;
                        }
                        p.line(
                            posX - EXTRA_BAR_VARIANCE,
                            height,
                            posX + EXTRA_BAR_VARIANCE,
                            height
                        );
                    }
                    p.noStroke();
                }
            }
        }
    };
};

export default p5Sketch;
