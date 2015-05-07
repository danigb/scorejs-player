'use strict';

function Instruments(ctx) {
  if(!(this instanceof Instruments)) return new Instruments(ctx);

  this.ctx = ctx;
  this.all = {};

  this.set('default', createDefaultInstrument(ctx));
  this.set('logger', function(note, time, duration) {
    if(console.log) console.log(note, time, duration);
  })
}

Instruments.prototype.get = function(name) {
  return (this.all[name] || this.all['default']);
}

Instruments.prototype.set = function(name, inst) {
  this.all[name] = inst;
}

function createDefaultInstrument(context) {
  return function play(note, time, duration) {
    var freq = getFrequencyOfNote(note.toUpperCase());
    console.log("OSC", note, freq, time, duration);

    var vco = context.createOscillator();
    vco.type = vco.SINE;
    vco.frequency.value = freq;

    /* VCA */
    var vca = context.createGain();
    vca.gain.value = 0.5;

    /* Connections */
    vco.connect(vca);
    vca.connect(context.destination);

    vco.start(time);
    vco.stop(time + duration);
  }
}

var getFrequencyOfNote = function (note) {
    var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    var octave = note.length === 3 ? note.charAt(2) : note.charAt(1);
    var index = notes.indexOf(note.slice(0, -1));
    var key_number = index + ((octave - 1) * 12) + 1;
    if(index < 3) key_number += 12;

    return 440 * Math.pow(2, (key_number - 49) / 12);
};

module.exports = Instruments;
