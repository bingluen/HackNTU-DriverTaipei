var request = require('request');
var CoordinateTransforms = require('../helper/CoordinateTransform');

var fs = require('fs-extra');
var path = require('path');
var moment = require('moment');

var construct = function() {
  this.url = "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=201d8ae8-dffc-4d17-ae1f-e58d8a95b162"
  this.logfile = fs.createOutputStream(path.join(__dirname, '../log', moment().format('YYYY-MM-DD-h-mm-ss-') + 'log_construct.log'));
}

construct.prototype.writeLogfile = function (messages, type) {

  this.logfile.write('[' + Date(Date.now()).toString() + ']' + (type ? '['+ type +']' : '') + messages + '\n');
};


construct.prototype.catching = function (next) {
  var parseDate = function(string) {
    //var d = new Date(string.slice(3, 5) + '/' + string.slice(5, 7));

    var d = new Date((parseInt(string.slice(0, 3)) + 1911) + '/' + string.slice(3, 5) + '/' + string.slice(5, 7));

    return d;
  }


  var filter = function(data) {
    this.writeLogfile('catched construct data');
    data = data.filter(function(element) {
      return (parseDate(element.CE_DA) > Date.now() && element.NPURP != '其他')
    })

    data = data.map(function(currentValue) {
      var obj = {}
      var latlng = CoordinateTransforms.TW97_WGS84(currentValue.X, currentValue.Y);
      obj.id = currentValue._id;
      obj.status = currentValue.NPURP;
      obj.lat = latlng.y;
      obj.lng = latlng.x;
      return obj
    });
    this.writeLogfile('send construct data');
    next(null, data);
  }.bind(this)

  this.writeLogfile('start to catching construct data');
  request(this.url, function(err, res, body) {
    if(!err) {
      filter(JSON.parse(body).result.results);
    } else {
      next(err)
    }
  });
}


module.exports = construct;
