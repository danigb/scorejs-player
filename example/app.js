
'use strict';

var soundfont = require('../lib/loader.js');
var score = require('scorejs');

var ctx = new AudioContext();
score.addPlugin(require('../index.js')(ctx));

var player;

function play() {
  var melo = score('c d e f | g a b c4  b a g f | (e d) c');
  var chords = score('Cmaj7 | Dm7 G7 | C6');
  var bass = chords.walkingBass({instrument: ''}).transpose('P-8');
  var piano = chords.leftHandPiano();
  return bass.merge(piano).play(ctx, { tempo: 60 });
}

document.addEventListener('load', function() {
  document.getElementById('play').addEventListener("click", function(e) {
    e.preventDefault();
    player = play();
  });
  document.getElementById('stop').addEventListener("click", function(e) {
    e.preventDefault();
    if(player) player.stop();
  });
}, true);



//soundfont.url = function(name) { return '/' + name + '-ogg.js'; }
soundfont(ctx, 'acoustic_grand_piano').then(function(instrument) {
  score.instruments.set('piano', instrument.play);
});
soundfont(ctx, 'acoustic_bass').then(function(instrument) {
  score.instruments.set('bass', instrument.play);
});
