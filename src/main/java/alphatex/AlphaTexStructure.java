package alphatex;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;

public class AlphaTexStructure {
    HashMap<String, String> attributesStr;
    HashMap<String, Integer> attributesInt;
    HashSet<String> attributesBool;

    LinkedList<Track> tracks;

    public AlphaTexStructure() {
        this.attributesStr = new HashMap<>();
        this.attributesInt = new HashMap<>();
        this.attributesBool = new HashSet<>();
        this.tracks = new LinkedList<>();
    }

    public String getStr(String attribute) {
        return attributesStr.get(attribute);
    }

    public Integer getInt(String attribute) { return attributesInt.get(attribute); }

    public void setStr(String attribute, String value) {
        attributesStr.put(attribute, value);
    }

    public void setInt(String attribute, Integer value) {
        attributesInt.put(attribute, value);
    }

    public void removeInt(String attribute) { attributesInt.remove(attribute); }

    public void addBool(String attribute) { attributesBool.add(attribute); }

    public HashSet<String> getAttributesBool() { return attributesBool; }

    public LinkedList<Track> getTracks() {
        return tracks;
    }

    public void addTrack(Track newTrack) {
        tracks.add(newTrack);
    }

    public void copyTracks(AlphaTexStructure source) {
        this.tracks.addAll(source.tracks);
    }

    public void copyAttributes(AlphaTexStructure source) {
        for (String attribute : source.attributesStr.keySet()) {
            this.setStr(attribute, source.attributesStr.get(attribute));
        }

        for (String attribute : source.attributesInt.keySet()) {
            this.setInt(attribute, source.attributesInt.get(attribute));
        }

        attributesBool.addAll(source.attributesBool);
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        for (String attribute : attributesStr.keySet()) {
            output.append(attribute).append(" : ").append(attributesStr.get(attribute)).append("\n");
        }

        for (String attribute : attributesInt.keySet()) {
            output.append(attribute).append(" : ").append(attributesInt.get(attribute)).append("\n");
        }

        if (this.tracks.size() > 0) {
            for (Track track : this.tracks) {
                output.append(track.toString()).append("\n");
            }
        }

        return output.toString();
    }

}
