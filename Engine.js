class Engine{
  constructor(engineSpecs = {stroke:2, cylinders:6, k:2, soundCurve:{i:20,j:2.5}}, soundTable = {}, volume = 0.3){
    this.soundTable = soundTable;
    this.soundCurve = engineSpecs.soundCurve;
    this.masterVolume = volume;
    this.oscs = {};
    this.stroke = engineSpecs.stroke;
    this.cylinders = engineSpecs.cylinders;
    this.k = engineSpecs.k;
    this.f = (1500)/((this.stroke/2)*(1/this.cylinders)*60*this.k);
    
    this.createFrequencies();
  }
  createFrequencies(){
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    for (const [key, v] of Object.entries(this.soundTable)) {
      let gain = audioCtx.createGain();
      let osc = audioCtx.createOscillator();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = v[1];
      osc.frequency.value = this.soundCurve.i*Math.sqrt(this.soundCurve.j*this.f+1)+v[2];
      gain.gain.value = this.masterVolume*v[0];
      this.oscs[key] = osc;
    }
  }
  updateRPM(rpm){
    this.f = (rpm)/((this.stroke/2)*(1/this.cylinders)*60*this.k);
  }
  playSound(){
    this.createFrequencies();
    for (const [key, v] of Object.entries(this.soundTable)) {
      this.oscs[key].start();
    }
    this.intervalId = setInterval(function(eng){
      for (const [key, v] of Object.entries(eng.soundTable)) {
        eng.oscs[key].frequency.value = eng.soundCurve.i*Math.sqrt(eng.soundCurve.j*eng.f+1)+v[2];
      }
    }, 40, this);
  }
  stopSound(){
    for (const [key, v] of Object.entries(this.soundTable)) {
      this.oscs[key].stop();
      this.oscs[key] = null;
    }
    clearInterval(this.intervalId);
  }
}