var Errorhandle = function (err, type) {
  this.err = err;
  this.type = type || 'html';
}

Errorhandle.prototype.do = function(err) {
  
}

module.exports = Errorhandle;
