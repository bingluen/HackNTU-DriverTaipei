var request = require('request');
var moment = require('moment');

var PBS = function() {
  this.url = 'http://210.69.35.216/data/api/pbs';
}

PBS.prototype.catching = function(next) {

  var filter = function(data) {
    data = data.filter(function(element) {
      return (element.region == 'N' && parseInt(element.x1) > 0 && parseInt(element.y1) > 0)
    });

    data = data.map(function(currentValue) {
      var obj = {}
      obj.id = currentValue.UID;
      obj.status = currentValue.roadtype;
      obj.lat = currentValue.y1;
      obj.lng = currentValue.x1;
      var dt = moment(currentValue.happendate+'T'+currentValue.happentime);
      obj.dt = dt.format('MM/DD hh:mm:ss')
      return obj;
    });

    next(null, data)
  }

  request(this.url, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      filter(JSON.parse(body).result);
    } else {
      next(err);
    }
  })
}

module.exports = PBS;
