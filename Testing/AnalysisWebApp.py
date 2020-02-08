pitchFile = open("pitches.txt",'r')

lines = pitchFile.readlines()
print("Time, Measured, Expected, Difference, Octave Difference")
for line in lines:
    temp = line.split()
    times = (float(temp[1])
    midi = (float(temp[0]))
    midiExpected = 40 + time // 1
    difference = midiExpected - midi
    octaveDiff = difference / 12.0
    print("{0:.2f}, {1:0.2f}, {2:.2f}, {3:.2f}, {4:.2f}".format(time, midi, midiExpected, difference, octaveDiff))
    
        
pitchFile.close()