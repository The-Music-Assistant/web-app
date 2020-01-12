package alphatex;

public class ParserOutput {
    public static final int SECONDS_IN_MINUTE = 60;
    AlphaTexStructure alphaTexStructure;
    JSONWriter jsonWriter;

    public ParserOutput(AlphaTexStructure alphaTexStructure) {
        this.alphaTexStructure = alphaTexStructure;
        jsonWriter = new JSONWriter();
    }

    public void parse() {
        double currentTempoFactor = (double) SECONDS_IN_MINUTE /
                (alphaTexStructure.getInt("tempo") != null ? alphaTexStructure.getInt("tempo") : 80);
        for (Track track : alphaTexStructure.getTracks()) {
            for (Staff staff : track.getTrackData().getStaffs()) {
                for (Measure measure : staff.getMeasures()) {
                    if (measure.getInt("tempo") != null) {
                        currentTempoFactor = (double) SECONDS_IN_MINUTE / measure.getInt("tempo");
                    }
                    for (Chord chord : measure.getChords()) {
                        for (Note note : chord.getNotes()) {
                            // TODO: Handle whole note in 2/4 time correctly
                            // TODO: Handle storing other metadata as needed
                            jsonWriter.addPitch(note.getMidiValue(), note.getDurationInSeconds(currentTempoFactor));
                        }
                    }
                }
            }
        }
    }

    @Override
    public String toString() {
        return jsonWriter.toString();
    }
}
