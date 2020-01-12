package alphatex;

import java.util.HashMap;
import java.util.LinkedList;

public class Measure {
    HashMap<String, String> attributesStr;
    HashMap<String, Integer> attributesInt;
    LinkedList<Chord> chords;

    public Measure() {
        attributesStr = new HashMap<>();
        attributesInt = new HashMap<>();
        chords = new LinkedList<>();
    }

    public void setStr(String attribute, String value) {
        attributesStr.put(attribute, value);
    }

    public void setInt(String attribute, Integer value) {
        attributesInt.put(attribute, value);
    }

    public Integer getInt(String attribute) { return attributesInt.get(attribute); }

    public void removeInt(String attribute) { attributesInt.remove(attribute); }

    public LinkedList<Chord> getChords() { return chords; }

    public void copyAttributes(AlphaTexStructure source) {
        for (String attribute : source.attributesStr.keySet()) {
            this.setStr(attribute, source.attributesStr.get(attribute));
        }

        for (String attribute : source.attributesInt.keySet()) {
            this.setInt(attribute, source.attributesInt.get(attribute));
        }
    }

    public void copyAttributes(Measure source) {
        for (String attribute : source.attributesStr.keySet()) {
            this.setStr(attribute, source.attributesStr.get(attribute));
        }

        for (String attribute : source.attributesInt.keySet()) {
            this.setInt(attribute, source.attributesInt.get(attribute));
        }
    }

    public void addChord(Chord chord) {
        chords.add(chord);
    }

    public void copy(Measure source) {
        copyAttributes(source);
        chords.addAll(source.chords);
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        output.append("Measure attributes: ").append("\n");
        for (String attribute : attributesStr.keySet()) {
            output.append("\t").append(attribute).append(" : ").append(attributesStr.get(attribute)).append("\n");
        }

        for (String attribute : attributesInt.keySet()) {
            output.append("\t").append(attribute).append(" : ").append(attributesInt.get(attribute)).append("\n");
        }

        output.append("Chords: ").append("\n");

        for (Chord chord : chords) {
            output.append(chord.toString()).append("\n");
        }

        return output.toString();
    }
}
