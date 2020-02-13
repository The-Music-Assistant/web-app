// import p5 from "./sketch";
// import PitchDetection from "./PitchDetection";

// class worker {
//     static init() {
//         const animateDrawing = function() {
//             p5.redraw();
//             // Gets the current pitch and sends it to displayMidi
//             PitchDetection.pitchDetectionModel.getPitch().then(frequency => {
//                 PitchDetection.displayMidi(frequency);
//             }).catch(err => {
//                 console.log(`[error][PitchDetection] ${err}`);
//                 PitchDetection.displayMidi(0);
//             });
//             requestAnimationFrame(animateDrawing());
//         }
//         self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
//             if (!e) return;
    
//             requestAnimationFrame(animateDrawing());
    
//             postMessage(e.data);
//         })
//     }
// }

const fib = i => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

self.addEventListener('message', e => {
  const count = e.data;
  postMessage(fib(count));
});

export default fib;

// export const calculatePrimes = (iterations, multiplier) => {
//   while(true)  {
//     let primes = [];
//     for (let i = 0; i < iterations; i++) {
//       let candidate = i * (multiplier * Math.random());
//       let isPrime = true;
      
//       for (var c = 2; c <= Math.sqrt(candidate); ++c) {
//         if (candidate % c === 0) {
//           // not prime
//           isPrime = false;
//           break;
//         }
//       }      if (isPrime) {
//         primes.push(candidate);
//       }
//     }    postMessage(primes);
//   }
// }