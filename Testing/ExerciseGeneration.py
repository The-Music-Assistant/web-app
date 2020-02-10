import random

def getSheetMusic():
    sheetMusicFile = open("SheetMusic")
    sheetMusicLines = sheetMusicFile.readlines()
    sheetMusicTracks = []
    currentTrack = []
    currentStaff = []
    currentMeasure = []
    currentChord = []
    for line in sheetMusicLines:
        temp = line.split()
        #print(temp[0] == "Track:")
        #print(line)
        if temp[0] == "Track:":
            if len(currentChord) > 0:
                currentMeasure.append(currentChord)
                currentChord = []
                currentStaff.append(currentMeasure)
                currentMeasure = []
                currentTrack.append(currentStaff)
                currentStaff = []
                sheetMusicTracks.append(currentTrack)
                currentTrack = []
            continue
        elif temp[0] == "Staff:":
            if len(currentChord) > 0:
                currentMeasure.append(currentChord)
                currentChord = []
                currentStaff.append(currentMeasure)
                currentMeasure = []
                currentTrack.append(currentStaff)
                currentStaff = []
            continue
        elif temp[0] == "Measure:":
            if len(currentChord) > 0:
                currentMeasure.append(currentChord)
                currentChord = []
                currentStaff.append(currentMeasure)
                currentMeasure = []
            continue
        elif (temp[0] == "{" or temp[0] == "}"):
            if len(currentChord) > 0:
                currentMeasure.append(currentChord)
                currentChord = []
            continue
        else:
            currentChord.append(temp)

    currentMeasure.append(currentChord)
    currentChord = []
    currentStaff.append(currentMeasure)
    currentMeasure = []
    currentTrack.append(currentStaff)
    currentStaff = []
    sheetMusicTracks.append(currentTrack)
    currentTrack = []
    return sheetMusicTracks
    

def getPerformance():
    performanceFile = open("performanceData")
    performanceFileLines = performanceFile.readlines()
    notes = []
    for line in performanceFileLines:
        temp = line.split()
        temp = [int(temp[0]),float(temp[1])]
        if len(notes) > 0:
            if notes[len(notes) - 1][0] == temp[0]:
                notes[len(notes) - 1][1] = notes[len(notes) - 1][1] + temp[1]
                continue
        notes.append(temp)
    return notes

def getSpecificTrack(trackName, sheetMusic):
    #This will eventually involve a way to choose which track we're actually getting
    #For now, we're just using Soprano
    return sheetMusic[0]

#Returns a list of notes (tracks currently are divided into staffs, measures, and chords)
#We're returning the notes of the first chord of the track, assuming we can ignore any secondary chords

def getExpectedNotes(track):
    staff = track[0] #Assumption 1
    notes = []
    measureNum = 0
    for measure in staff:
        chord = measure[0] #Assumption 2
        for note in chord:
            note = [int(note[0]), float(note[1])]
            if len(notes) > 0 and notes[len(notes) - 1][0][0] == note[0]:
                notes[len(notes) - 1][0][1] = notes[len(notes) - 1][0][1] + note[1]
                if measureNum not in notes[len(notes) - 1][1]:
                    notes[len(notes) - 1][1].append(measureNum) #Keeping track of measures the note is in
            else:
                notes.append([note, [measureNum]])
        measureNum = measureNum + 1
    return notes, measureNum + 1

def deformPerformance(performance):
    time = 0
    for note in performance:
        note[0] = note[0] + random.randrange(-5,5)
        if note[0] < 35:
            note[0] = -1
        note[1] = note[1] * (random.random() / 2.0 + .75) #Duration of .75 - 1.25 expected duration
        time = time + note[1]

def printCSV(expectedNotes, performance):
    time = 0
    sheetTime = expectedNotes[0][0][1]
    performanceTime = performance[0][1]
    sheetIndex = 0
    performanceIndex = 0
    while (time < 35):
        if sheetTime < time:
            sheetIndex = sheetIndex + 1
            if sheetIndex < len(expectedNotes):
                sheetTime = sheetTime + expectedNotes[sheetIndex][0][1]
        if performanceTime < time:
            performanceIndex = performanceIndex + 1
            if performanceIndex < len(performance):
                performanceTime = performanceTime + performance[performanceIndex][1]
        sheetPitch = -1
        performancePitch = -1
        if sheetIndex < len(expectedNotes):
            sheetPitch = expectedNotes[sheetIndex][0][0]
        if performanceIndex < len(performance):
            performancePitch = performance[performanceIndex][0]
        print("{0:.2f}\t{1:.2f}\t{2:.2f}".format(time, sheetPitch, performancePitch))
        time = time + .05
    
random.seed(0)
sheetMusic = getSheetMusic()
performance = getPerformance()
deformPerformance(performance)
track = getSpecificTrack("Track Name", sheetMusic)
expectedNotes, numberOfMeasures = getExpectedNotes(track)

noteIndex = 0
measureErrors = []
for i in range(numberOfMeasures - 1):
    measureErrors.append([0,0,0, i]) #Duration, Pitch, Subsequent Bad

for note in expectedNotes:
    expectedMIDI = note[0][0]
    expectedDuration = note[0][1] #This is how long we expected the performance note to last
    performedDuration = 0
    #For each note in the performance, until we reach the expected duration
    #(or within .08 of that duration)
    #0.8 is half the length of our shortest note; should make this vary depending on the tempo
    comparisonNotes = []
    performedMIDI = 0
    longestComparisonNote = [-1, 0]
    while ((expectedDuration - performedDuration) > 0.08 and noteIndex < len(performance)):
        performedNote = performance[noteIndex]
        noteIndex = noteIndex + 1
        performedDuration = performedDuration + performedNote[1]
        comparisonNotes.append(performedNote)
        performedMIDI = performedMIDI + performedNote[0] * performedNote[1] #MIDI * duration; for avging later
        if performedNote[1] > longestComparisonNote[1]:
            longestComparisonNote = [performedNote[0], performedNote[1]]
    if performedDuration == 0:
        performedDuration = -1
    performedMIDI = performedMIDI / performedDuration #The Average MIDI over the time sung is the performed MIDI
    
    #Assuming there might have been a minor error notes, we add all comparison notes with the same duration
    #To our comparison duration thingy
    longestComparisonNote[1] = 0
    for comparisonNote in comparisonNotes:
        if comparisonNote[0] == longestComparisonNote[0]:
            longestComparisonNote[1] = longestComparisonNote[1] + comparisonNote[1]
            
    heldDuration = longestComparisonNote[1]
    durationDifference = abs(heldDuration - expectedDuration)/expectedDuration
    if durationDifference < 0: #Replace with some epsilon
        durationDifference = 0
    pitchDifference = abs(performedMIDI - expectedMIDI) * expectedDuration
    for measureIndex in note[1]:
        measureErrors[measureIndex][0] = measureErrors[measureIndex][0] + durationDifference
        measureErrors[measureIndex][1] = measureErrors[measureIndex][1] + pitchDifference

for i in range(numberOfMeasures - 1):
    for j in range(i, numberOfMeasures - 1):
        if measureErrors[j][1] < measureErrors[i][1]:
            break
        measureErrors[i][2] = j - i
        
measureErrors.sort(reverse = True)
for i in range(numberOfMeasures - 1):
    print("{0}: {1:.2f}, {2:.2f}, {3}".format(measureErrors[i][3], measureErrors[i][0], measureErrors[i][1], measureErrors[i][2]))
    
