'use strict';

var Clock = require('./lib/clock.js');
var Scheduler = require('./lib/scheduler.js')

module.exports = function(Score) {

  Score.fn.region = function(begin, end) {
    return this.filter(function(event) {
      return event.position >= begin &&
        event.position < end;
    });
  }

  var NOINST = {
    play: function(name, time) { console.log(name, time); }
  };
  Score.fn.play = function(audioContext, options) {
    options = options || {};
    var tempo = options.tempo || 120;
    var inst = options.instrument || NOINST;
    var ctx = audioContext || options.audioContext;

    if (!ctx) throw Error('AudioContext required.');

    var clock = Clock(ctx, tempo);

    var seq = this;
    clock.scheduler = Scheduler(this, clock, function(event, time, secsPerTick) {
      var note = event.value.toString();
      var duration = event.duration * secsPerTick;
      inst.play(note, time, duration);
    });
    clock.start();
    return clock;
  }
}
