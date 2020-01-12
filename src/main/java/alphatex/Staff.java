package alphatex;

import java.util.HashMap;
import java.util.LinkedList;

public class Staff {
    String staffOption;
    HashMap<String, String> attributesStr;
    LinkedList<Measure> measures;

    public Staff() {
        attributesStr = new HashMap<>();
        measures = new LinkedList<>();
    }

    public void setStaffOption(String option) {
        staffOption = option;
    }

    public void copyAttributes(AlphaTexStructure source) {
        for (String attribute : source.attributesStr.keySet()) {
            attributesStr.put(attribute, source.attributesStr.get(attribute));
        }
    }

    public void copyAttributes(Staff source) {
        for (String attribute : source.attributesStr.keySet()) {
            attributesStr.put(attribute, source.attributesStr.get(attribute));
        }
    }

    public void copyMeasures(Staff source) {
        measures.addAll(source.measures);
    }

    public void addMeasure(Measure measure) {
        measures.add(measure);
    }

    public LinkedList<Measure> getMeasures() {
        return measures;
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        output.append("Staff: ").append("\n");
        output.append("Staff option: ").append(staffOption).append("\n");

        output.append("Staff attributes: ").append("\n");
        for (String attribute : attributesStr.keySet()) {
            output.append("\t").append(attribute).append(" : ").append(attributesStr.get(attribute)).append("\n");
        }
        output.append("\n");

        for (Measure measure : measures) {
            output.append(measure.toString()).append("\n");
        }

        return output.toString();
    }
}
