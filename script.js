let engine;
let f;

let engineSpecs = {
  stroke:4,
  cylinders:6,
  k:2.5,
  soundCurve:{
    i:9,
    j:1
  }
}

let soundTable = {
  0:[1,'sine',0],
  1:[0.3,'sine',40],
  2:[0.001,'square',-10],
  3:[0.001,'sawtooth',20],
  4:[0.2,'sine',100],
  5:[0.5,'sine',70],
  6:[0.00125,'sawtooth',220],
  7:[0.2,'sine',160],
  8:[0.6,'sine', 40]
};

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  var start = document.getElementById("start"),
      stop = document.getElementById("stop");
  var intervalId;

  var oscs = {};
  
  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");

  engine = new Engine(engineSpecs, soundTable, 0.3);
  output.innerHTML = slider.value+' Freq: '+engine.f;

  slider.oninput = function() {
    engine.updateRPM(this.value);
    output.innerHTML = this.value +' Freq: '+engine.f;
  }

  start.addEventListener("click", function(e){
    engine.playSound();
  });

  stop.addEventListener("click", function(e){
    engine.stopSound();
  });
});
