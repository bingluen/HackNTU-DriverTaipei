var request = require('request');
var moment = require('moment');
var fs = require('fs-extra');
var path = require('path');

var PBS = function() {
  this.url = 'http://210.69.35.216/data/api/pbs';
  this.logfile = fs.createOutputStream(path.join(__dirname, '../log', moment().format('YYYY-MM-DD-h-mm-ss-') + 'log_pbs.log'));
}

PBS.prototype.writeLogfile = function (messages, type) {

  this.logfile.write('[' + Date(Date.now()).toString() + ']' + (type ? '['+ type +']' : '') + messages + '\n');

};

PBS.prototype.catching = function(next) {

  var filter = function(data) {
    this.writeLogfile('catched pbs data');
    data = data.filter(function(element) {
      return (element.region == 'N' && parseInt(element.x1) > 0 && parseInt(element.y1) > 0 && element.roadtype != '其他' && !element.comment.match('已排除'))
    });

    data = data.map(function(currentValue) {
      var obj = {}
      obj.id = currentValue.UID;
      obj.status = currentValue.roadtype;
      obj.lat = currentValue.y1;
      obj.lng = currentValue.x1;
      return obj;
    });
    this.writeLogfile('send pbs data');
    next(null, data)
  }.bind(this)

  this.writeLogfile('start to catching pbs data');
  request(this.url, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      filter(JSON.parse(body).result);
    } else {
      next(err);
    }
  }.bind(this))
}

module.exports = PBS;
