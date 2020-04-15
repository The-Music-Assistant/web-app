/**
 * @class
 * @classdesc Encapsulates a recorded pitch
 * @category PitchDetection
 * @author Daniel Griessler <dgriessler20@gmail.com>
 */
class Pitch {
    /**
     * Creates a Pitch
     * @param {Number} note Percieved pitch
     * @param {Number} time Time when the note was started
     */
    constructor(note, time) {
        this.midival = note;
        this.timepos = time;
    }
}

export default Pitch;
