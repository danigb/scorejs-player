
var NOOP = function() {};

function Clock(ctx, options) {
  if(!(this instanceof Clock)) return new Clock(ctx, options);

  this.ctx = ctx;
  options = options || {};
  this.options = {};
  this.options.lookahead = options.lookahead || 25.0;
  this.options.scheduleAheadTime = options.scheduleAheadTime || 0.1;
  this.options.tempo = options.tempo || 120;
  this.options.ticksPerBeat = options.ticksPerBeat || 96;

  this.tempo(this.options.tempo);

  this.tickOp = NOOP;
  this.nextTick = 0;
  this.nextTickTime = 0;

  this.timer = null;
  this.running = false;
}

Clock.prototype.schedule = function() {
  if(this.running) {
    var nextTime = this.ctx.currentTime + this.options.scheduleAheadTime
    while(this.nextTickTime < nextTime) {
      this.tickOp(this.nextTick, this.nextTickTime);
      this.nextTick++;
      this.nextTickTime += this.tickInterval;
    }
    setTimeout(this.schedule, this.options.lookahead);
  }
}

Clock.prototype.tempo = function(newTempo) {
  if(arguments.length === 0) return this.options.tempo;
  this.options.tempo = newTempo;
  this.tickInterval = (60 / newTempo) / this.options.ticksPerBeat;
  return this;
}

Clock.prototype.tick = function(tickOp) {
  if(arguments.length === 0) return this.tickOp;
  this.tickOp = tickOp;
  return this;
}

Clock.prototype.start = function(tempo) {
  if(tempo) this.tempo(tempo);
  this.nextTick = 0;
  this.nextTickTime = this.ctx.currentTime;
  this.running = true;
  this.schedule();
  return this;
}

Clock.prototype.stop = function() {
  this.running = false;
  if (this.timer) clearTimeout(this.timer);
  return this;
}


module.exports = Clock;
