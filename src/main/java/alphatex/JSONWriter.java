package alphatex;

import org.json.JSONObject;

import java.io.FileWriter;
import java.io.IOException;

public class JSONWriter {
    JSONObject mainObj;

    public JSONWriter() {
        mainObj = new JSONObject();
    }

    public void addPitch(int midi, double time) {
        JSONObject pitch = new JSONObject();
        pitch.put("midiValue", midi);
        pitch.put("duration", time);
        mainObj.accumulate("pitches", pitch);
    }

    public void output(String path) {
        try (FileWriter file = new FileWriter(path)) {
            file.write(mainObj.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return mainObj.toString();
    }
}
