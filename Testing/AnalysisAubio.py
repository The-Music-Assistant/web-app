import os
import subprocess
import statistics
# import matplotlib.pyplot as plt
import numpy

path = ""
filename = "Sound.wav"
filePath = path + filename

pitchFile = open(path + "pitches.txt",'r')

# process = subprocess.Popen(['aubio', 'pitch',filePath], stdout=pitchFile)
# pitchFile.seek(0)
lines = pitchFile.readlines()
times = []
pitches = []
for line in lines:
    temp = line.split()
    times.append(float(temp[0]))
    pitches.append(float(temp[1]))

goodPitches = []
currentNote = []
start = 0
end = 0
starts = []
ends = []
notes = []
sdLimit = 0.05
midiValues = []
for i in range(len(pitches)):
    midi = 0
    if pitches[i] > 0:
        midi = 12*numpy.log2(pitches[i]/440) + 69
    midiValues.append(midi)
    if i >= 10:
        stddev = statistics.stdev(midiValues[i-10:i])
        #print("{0:.2f}, {1:.2f}, {2:.2f}".format(times[i], midi, stddev))

    
for i in range(10, len(midiValues)):
    #print("Test")
    stdev = statistics.stdev(midiValues[i - 10: i])
    if stdev < 5:
        midi = midiValues[i]
        #print("{0:.2f}, {1:.2f}, {2:.2f}, {3:.2f}, {4:.2f}".format(times[i], pitches[i], midi, stdev, avg))
        #print(stdev)
        if stdev < sdLimit:
            end = 0
            if start == 0:
                start = times[i]
                starts.append(start)
                # print("Start: {0:.2f}".format(times[i]))
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
        
pitchFile.close()