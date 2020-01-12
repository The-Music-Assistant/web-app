package alphatex;

import java.util.LinkedList;

public class Chord {
    LinkedList<Note> notes;

    public Chord() {
        notes = new LinkedList<>();
    }

    public LinkedList<Note> getNotes() { return notes; }

    public void addNote(Note note) {
        notes.add(note);
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        output.append("{");
        int noteCounter = notes.size();
        for (Note note : notes) {
            output.append(note.toString());
            if (noteCounter > 1) {
                output.append(" ");
                noteCounter--;
            }
        }
        output.append("}");

        return output.toString();
    }
}
