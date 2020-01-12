package alphatex;

import java.util.HashSet;

public class Note {
    public static final int BASE_MIDI_OCTAVE_ZERO = 21;
    public static final int BASE_MIDI_OCTAVE_ONE = 24;
    public static final int NUM_HALF_BETWEEN_OCTAVE = 12;
    String note;
    int octave;
    int duration;
    HashSet<String> beatEffects;
    HashSet<String> noteEffects;

    public Note() {
        beatEffects = null;
        noteEffects = null;
        note = "";
        octave = -1;
        duration = -1;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public void setOctave(int octave) {
        this.octave = octave;
    }

    public int getDuration() { return duration; }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void addBeatEffect(String effect) {
        if (beatEffects == null) {
            beatEffects = new HashSet<>();
        }

        beatEffects.add(effect);
    }
    public boolean containsBeatEffect(String effect) {
        return beatEffects != null && beatEffects.contains(effect);
    }

    public void copyEffects(HashSet<String> source) {
        if (source.size() == 0) {
            return;
        }

        if (beatEffects == null) {
            beatEffects = new HashSet<>();
        }
        beatEffects.addAll(source);
    }

    private int getNoteOffset() {
        int base;
        switch(note.charAt(0)) {
            case 'c': base = 0;
            break;
            case 'd': base = 2;
            break;
            case 'e': base = 4;
            break;
            case 'f': base = 5;
            break;
            case 'g': base = 7;
            break;
            case 'a': base = 9;
            break;
            case 'b': base = 11;
            break;
            default:
                base = -1;
        }

        for (int i =  1; i < note.length(); i++) {
            if (note.charAt(i) == '#') {
                base++;
            } else if (note.charAt(i) == 'b') {
                base--;
            }
        }

        return base;
    }

    public int getMidiValue() {
        if (octave < 0) {
            return -1;
        }

        int midi = octave == 0 ? BASE_MIDI_OCTAVE_ZERO : BASE_MIDI_OCTAVE_ONE;
        int adjustedOctave = octave == 0 ? 0 : octave - 1;

        return midi + NUM_HALF_BETWEEN_OCTAVE * adjustedOctave + getNoteOffset();
    }

    public double getDurationInSeconds(double currentTempoFactor) {
        double durationInSeconds = currentTempoFactor * duration;
        if (beatEffects != null && beatEffects.contains("dotted")) {
            durationInSeconds *= 1.5;
        }
        return durationInSeconds;
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        output.append(note);

        if (octave > 0) {
            output.append(octave);
        }

        if (beatEffects != null && beatEffects.size() > 0) {
            output.append("{");
            for (String beatEffect : beatEffects) {
                output.append(" ").append(beatEffect);
            }
            output.append(" }");
        }
        output.append(".").append(duration);
        if (noteEffects != null && noteEffects.size() > 0) {
            output.append("{");
            for (String noteEffect : noteEffects) {
                output.append(" ").append(noteEffect);
            }
            output.append(" }");
        }

        return output.toString();
    }
}
