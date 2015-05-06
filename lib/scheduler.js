

function scheduler(seq, clock, callback) {
  var duration = seq.duration();
  var player = function(begin, end, time, timePerClick) {
    seq.region(begin, end).events.forEach(function(event) {
      callback(event, time, timePerClick)
    });
    if(end > duration) clock.stop();
  }
  var scheduler = tickToRegion(seq.time, clock, player);
  return scheduler;
}

function tickToRegion(time, clock, callback) {
  var ticksPerClock = time.ticksPerBeat / clock.ticksPerBeat;
  var timePerClick = (60 / clock.tempo()) / time.ticksPerBeat;
  return function(tick, time) {
    var begin = tick * ticksPerClock;
    var end = (tick + 1) * ticksPerClock - 1;
    callback(begin, end, time, timePerClick);
  }
}

module.exports = scheduler;
