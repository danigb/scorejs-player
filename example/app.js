
'use strict';

var soundfont = require('../lib/loader.js');
var score = require('scorejs');

score.plugins(require('../index.js'));

var ctx = new AudioContext();

function play(instrument) {
  score('c d e f g a b c4 b a g f e d c').play(ctx, {
    tempo: 60,
    instrument: instrument
  });
}

console.log("Loading....");
soundfont.url = function(name) { return '/' + name + '-ogg.js'; }
 soundfont(ctx, 'acoustic_grand_piano').then(function(instrument) {
   play(instrument);
 });

//play();
