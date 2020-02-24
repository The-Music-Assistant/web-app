class TexLoaded {
    constructor(typeOfTex, partNames, clefs, myPart, id, measureStart, measureEnd) {
        this.typeOfTex = typeOfTex;
        this.partNames = partNames;
        this.myPart = myPart;
        this.mutedTracks = [];
        this.clefs = clefs;
        if (this.clefs) {
            this.clefs.forEach((track) => {
                for (let i = 0; i < track.length; i++) {
                    track[i] = track[i].toLowerCase();
                }
                this.mutedTracks.push(false);
            });
        }
        this.currentTrackIndexes = [0];
        this.firstBarMeasurePosition = null;
        this.measureLengths = null;
        this.id = id;
        this.measureStart = measureStart;
        this.measureEnd = measureEnd;
    }

    update(typeOfTex, partNames, clefs, myPart, id, measureStart, measureEnd) {
        this.typeOfTex = typeOfTex;
        this.partNames = partNames;
        this.clefs = clefs;
        if (this.clefs) {
            this.clefs.forEach((track) => {
                for (let i = 0; i < track.length; i++) {
                    track[i] = track[i].toLowerCase();
                }
                this.mutedTracks.push(false);
            });
        }
        this.myPart = myPart;
        this.currentTrackIndexes = [0];
        this.firstBarMeasurePosition = null;
        this.measureLengths = null;
        this.id = id;
        this.measureStart = measureStart;
        this.measureEnd = measureEnd;
    }

    getStartOctave() {
        const TREBLE_START = 4;
        const BASS_START = 2;
        let trackIndex = this.currentTrackIndexes[0];
        if (trackIndex > this.clefs.length || this.clefs[trackIndex][0] === 'treble') {
            return TREBLE_START;
        } else if (this.clefs[trackIndex][0] === 'f4' || this.clefs[trackIndex][0] === 'bass') {
            return BASS_START;
        } else {
            return TREBLE_START;
        }
    }

    updateCurrentTrackIndexes(trackIndex) {
        this.currentTrackIndexes[0] = trackIndex;
    }
}

export default TexLoaded;