let f = 0;
let stroke = 4;
let cylinders = 6;
let k = 2.2;

let soundTable = {
  0:[1,'sine',0],
  1:[0.3,'sine',40],
  2:[0.001,'square',-10],
  3:[0.001,'sawtooth',20],
  4:[0.2,'sine',100],
  5:[0.5,'sine',70],
  6:[0.00125,'sawtooth',220],
  7:[0.2,'sine',160],
};

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  var start = document.getElementById("start"),
      stop = document.getElementById("stop"),
      intervalId;

  var oscs = {};
  
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  f = (slider.value)/((stroke/2)*(1/cylinders)*60*k);
  output.innerHTML = slider.value+' Freq: '+f;

  slider.oninput = function() {
    f = (this.value)/((stroke/2)*(1/cylinders)*60*k);
    output.innerHTML = this.value +' Freq: '+f;
  }

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  start.addEventListener("click", function(e){
    
    for (const [key, v] of Object.entries(soundTable)) {
      let gain = audioCtx.createGain();
      let osc = audioCtx.createOscillator();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = v[1];
      osc.frequency.value = f+v[2];
      gain.gain.value = 0.3*v[0];
      oscs[key] = osc;
    }
    
    for (const [key, v] of Object.entries(soundTable)) {
      
      oscs[key].start();
    }
    
    intervalId = setInterval(function(){
        for (const [key, v] of Object.entries(soundTable)) {
          oscs[key].frequency.value = f+v[2];
        }
      }, 40);
  });

  stop.addEventListener("click", function(e){
    for (const [key, v] of Object.entries(soundTable)) {
      oscs[key].stop();
      oscs[key] = null;
    }
    clearInterval(intervalId);
  });
});
