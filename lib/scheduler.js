
function scheduler(score, clockTicksPerBeat) {
  var events = score.events;
  var ticksPerClockTick = events.time.clicksPerBeat / clockTicksPerBeat;
  console.log("TICKS per clock tick", ticksPerClockTick);

  var current = 0;
  return function(clockTick, time) {
    var nextTick = (clockTick + 1) * ticksPerClockTick;

    var event = events[current];
    while(event && event.position < nextTick) {
      instrument.play(event.str(), time);
      current++;
      event = events[current];
    }
  }

}

module.exports = scheduler;
