'use strict';

var Clock = require('./lib/clock.js');
var Scheduler = require('./lib/scheduler.js')
var Instruments = require('./lib/instruments.js');

module.exports = function(audioContext) {

  return function(Score) {
    Score.instruments = new Instruments(audioContext);

    Score.fn.play = function(options) {
      options = options || {};
      var tempo = options.tempo || 120;
      var ctx = audioContext || options.audioContext;

      if (!ctx) throw Error('AudioContext required.');

      var clock = Clock(ctx, tempo);

      var seq = this;
      clock.scheduler = Scheduler(this, clock, function(event, time, secsPerTick) {
        var note = event.value.toString();
        var duration = event.duration * secsPerTick;
        var inst = Score.instruments.get(event.instrument);
        inst(note, time, duration);
      });
      clock.start();
      return clock;
    }
  }
}
