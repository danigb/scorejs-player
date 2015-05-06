
'use strict';

var soundfont = require('../lib/loader.js');
var score = require('scorejs');
var Clock = require('../lib/clock.js');

score.plugin(require('../lib/play-bass.js'));

var ctx = new AudioContext();

function play(instrument) {
  var s = score('Cmaj7 | Dm7 G7 | Cmaj7')
  var chords = s.clone().playChords();
  var i = Iterator(chords);
  var clock = new Clock(ctx).tick(function(tick, time) {
    var nextTick = (tick + 1) * 16;
    while(i.peek() && i.peek().position < nextTick) {
      var evt = i.next();
      instrument.play(evt.str(), time);
    }
    if(!i.peek()) clock.stop();
  });

  clock.start(120);
}

console.log("Loading....");
soundfont.url = function(name) { return '/' + name + '-ogg.js'; }
soundfont(ctx, 'acoustic_grand_piano').then(function(instrument) {
  play(instrument);
});

function Iterator(score) {
  if(!(this instanceof Iterator)) return new Iterator(score);
  this.events = score.events;
  this.current = 0;
}

Iterator.prototype.peek = function() {
  return this.events[this.current];
}
Iterator.prototype.next = function() {
  var current = this.events[this.current];
  this.current++;
  return current;
}
