
var NOOP = function() {};

function Clock(ctx, options) {
  if(!(this instanceof Clock)) return new Clock(ctx, options);

  options = options || {};

  this.ctx = ctx;
  this.lookahead = options.lookahead || 25.0;
  this.scheduleAheadTime = options.scheduleAheadTime || 0.1;
  this.ticksPerBeat = options.ticksPerBeat || 6;
  this.tempo(options.tempo || 120);

  this.scheduler = NOOP;
  this.nextTick = 0;
  this.nextTickTime = 0;

  this.timer = null;
  this.running = false;
}

Clock.prototype.schedule = function() {
  if(this.running) {
    var nextTime = this.ctx.currentTime + this.scheduleAheadTime
    while(this.nextTickTime < nextTime) {
      this.scheduler(this.nextTick, this.nextTickTime);
      this.nextTick++;
      this.nextTickTime += this.tickInterval;
    }
    setTimeout(this.schedule.bind(this), this.lookahead);
  }
}

Clock.prototype.tempo = function(newTempo) {
  if(arguments.length === 0) return this._tempo;
  this._tempo = newTempo;
  this.tickInterval = (60 / newTempo) / this.ticksPerBeat;
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
