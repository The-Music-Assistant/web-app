import statistics

midiFile = open("pitches.txt",'r')

lines = midiFile.readlines()
times = []
midiValues = []
for line in lines:
    temp = line.split()
    times.append(float(temp[0]))
    midiValues.append(float(temp[1]))

goodPitches = []
currentNote = []
start = 0
end = 0
starts = []
ends = []
notes = []
sdLimit = 0.05
    
for i in range(10, len(midiValues)):
    stdev = statistics.stdev(midiValues[i - 10: i])
    midi = midiValues[i]
    if stdev < sdLimit:
        end = 0
        if start == 0:
            start = times[i]
            starts.append(start)
            #print("Start: {0:.2f}".format(times[i]))
            currentNote.append(midi)
    if stdev > sdLimit:
        start = 0
        if end == 0 and len(currentNote) > 0:
            end = times[i]
            note = statistics.mean(currentNote)
            currentNote = []
            ends.append(end)
            notes.append(note)
            # print("Note: {0:.2f}".format(note))
            # print("End: {0:.2f}".format(times[i]))
print("Start, MIDI, Duration (s)")
for i in range(len(notes)):
    print("{0:.2f}, {1:.2f}, {2:.2f}".format(starts[i], notes[i], ends[i] - starts[i]))
        
midiFile.close()