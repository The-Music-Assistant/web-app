package alphatex;

import java.util.LinkedList;

public class Track {
    LinkedList<String> trackNames;
    TrackMetadata trackData;

    public Track() {
        trackNames = new LinkedList<>();
        trackData = new TrackMetadata();
    }

    public void addTrackName(String name) { trackNames.add(name); }

    public TrackMetadata getTrackData() { return trackData; }

    public void copy(Track source) {
        trackNames.addAll(source.trackNames);
        trackData.copy(source.trackData);
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        output.append("Track Name : ");
        for (String trackName : trackNames) {
            output.append(trackName).append("  ");
        }
        output.append("\n");

        output.append("Track Metadata: ").append("\n");
        output.append(trackData.toString());
        return output.toString();
    }
}
