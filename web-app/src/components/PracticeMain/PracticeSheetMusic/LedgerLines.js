const HALF_STEP_CYCLE_UP_START_C = [1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7];
const HALF_STEP_CYCLE_UP_START_A = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 1, 1, 1];
const HALF_STEP_CYCLE_DOWN_START_C = [1, 1, 7, 7, 7, 6, 6, 6, 6, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1];
const HALF_STEP_CYCLE_DOWN_START_E = [2, 2, 1, 1, 1, 7, 7, 7, 7, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 2];

class LedgerLines {
    static getNumberOfLedgerLines(midi, direction, start) {
        let index = this.getOctave(midi) % 2 === 0 ? 0 : 12;
        index += midi % 12;
        let realDirection = direction.toLowerCase();
        let realStart = start.toLowerCase();
        if (realDirection === "up") {
            if (realStart === "c") {
                return HALF_STEP_CYCLE_UP_START_C[index];
            } else if (realStart === "a") {
                return HALF_STEP_CYCLE_UP_START_A[index];
            }
        } else if (realDirection === "down") {
            if (realStart === "c") {
                return HALF_STEP_CYCLE_DOWN_START_C[index];
            } else if (realStart === "e") {
                return HALF_STEP_CYCLE_DOWN_START_E[index];
            }
        }

        return 0;
    }

    /**
     * Gets the octave of the current note
     * @returns The octave of the current note
     */
    static getOctave(midi) {
        return Math.floor(midi / 12) - 1;
    }
}

module.exports = LedgerLines;