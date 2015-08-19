var request = require('request');
var CoordinateTransforms = require('../helper/CoordinateTransform');

var construct = function() {
  this.url = "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=201d8ae8-dffc-4d17-ae1f-e58d8a95b162"
}


construct.prototype.catching = function (next) {
  var parseDate = function(string) {
    return string.slice(3, 5) + '/' + string.slice(5, 7);
  }


  var filter = function(data) {
    data = data.map(function(currentValue) {
      var obj = {}
      var latlng = CoordinateTransforms.TW97_WGS84(currentValue.X, currentValue.Y);
      obj.id = currentValue._id;
      obj.status = currentValue.NPURP;
      obj.lat = latlng.y;
      obj.lng = latlng.x;
      obj.startDay = parseDate(currentValue.CB_DA);
      obj.completeDay = parseDate(currentValue.CE_DA);
      return obj
    });

    next(null, data);
  }

  request(this.url, function(err, res, body) {
    if(!err) {
      filter(JSON.parse(body).result.results);
    } else {
      next(err)
    }
  });
}


module.exports = construct;
