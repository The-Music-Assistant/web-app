

const fs = require('fs')

const portAudio = require('naudiodon')
// if (process.argv.length < 3) {
//   console.log("Usage: AUDIO_FILE");
//   process.exit()
// } 

class AnalysisComparer {

  static play(filePath) {
    if (!fs.existsSync(filePath)) {
      console.log("Error: Can't find", filePath, "")
      return;
    }
    // Create an instance of AudioIO with outOptions (defaults are as below), which will return a WritableStream
    let ao = new portAudio.AudioIO({
      outOptions: {
        channelCount: 2,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 48000,
        deviceId: -1, // Use -1 or omit the deviceId to select the default device
        closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
      }
    });

    // Create a stream to pipe into the AudioOutput
    // Note that this does not strip the WAV header so a click will be heard at the beginning
    let rs = fs.createReadStream(filePath);

    // Start piping data and start streaming
    rs.pipe(ao);
    ao.start();
  }
}
// try {
//   stats = fs.lstatSync(process.argv[2]);
//   if (!stats.isFile()) {
//     console.log("Usage: AUDIO_FILE");
//     process.exit()
//   }
// } catch (error) {
//   console.log("Usage: AUDIO_FILE");
//   process.exit()
// }

module.exports = AnalysisComparer