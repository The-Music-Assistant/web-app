package alphatex;

import java.util.LinkedList;

public class TrackMetadata {
    LinkedList<String> tuning;
    LinkedList<Staff> staffs;

    public TrackMetadata() {
        tuning = new LinkedList<>();
        staffs = new LinkedList<>();
    }

    public void addTuning(String newTuning) {
        tuning.add(newTuning);
    }

    public LinkedList<Staff> getStaffs() { return staffs; }

    public void addStaff(Staff staff) {
        staffs.add(staff);
    }

    public void copy(TrackMetadata source) {
        tuning.addAll(source.tuning);
        staffs.addAll(source.staffs);
    }

    @Override
    public String toString() {
        StringBuilder output = new StringBuilder();

        output.append("Tuning: ");
        for (String nextTuning : tuning) {
            output.append(nextTuning).append("  ");
        }
        output.append("\n");

        output.append("Staffs: \n");
        for (Staff staff : staffs) {
            output.append(staff.toString()).append("\n");
        }

        return output.toString();
    }
}
