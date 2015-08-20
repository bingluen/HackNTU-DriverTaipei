var Errorhandle = function (err, type) {
  this.err = err;
  this.statusCode = this.err.statusCode || 500
  this.type = type || 'html';
}

Errorhandle.prototype.do = function(req ,res, next) {
  if(this.type == 'html') {
    res.status(this.statusCode).json({
      err: 'err'
    })
  } else if(this.type == 'json') {
    res.status(this.statusCode).json({
      err: this.err.message,
      statusCode: this.statusCode
    });
  }
}

module.exports = Errorhandle;
