var request = require('request');
var CoordinateTransforms = require('../helper/CoordinateTransform');

var VD = function() {
  this.url = "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=5aacba65-afda-4ad5-88f5-6026934140e6"
}

VD.prototype.catching = function(callback) {
  var getSpeedLevel = function(value) {
    value = parseInt(value);
    if(value < 20) {
      return 'low'
    } else if (value > 50) {
      return 'fast'
    } else {
      return 'medium'
    }
  }

  var filter = function(data) {
    data = data.map(function(currentValue) {
      var obj = {};

      var WGS84 = {
          start: {
            x: parseFloat(currentValue.StartWgsX),
            y: parseFloat(currentValue.StartWgsY)
          },
          end : {
            x: parseFloat(currentValue.EndWgsX),
            y: parseFloat(currentValue.EndWgsY)
          }
      };

      var TW97 = {
        start: CoordinateTransforms.WGS84_TW97(WGS84.start.x, WGS84.start.y),
        end : CoordinateTransforms.WGS84_TW97(WGS84.end.x, WGS84.end.y)
      }

      obj.id = currentValue._id;
      obj.name = currentValue.SectionName;
      obj.carLevel = getSpeedLevel(currentValue.AvgSpd);
      obj.lng = (parseFloat(currentValue.StartWgsX) + parseFloat(currentValue.EndWgsX)) / 2.0;
      obj.lat = (parseFloat(currentValue.StartWgsY) + parseFloat(currentValue.EndWgsY)) / 2.0;
      obj.width = Math.abs(TW97.start.x - TW97.end.x) / 2.0;
      obj.height = Math.abs(TW97.start.y - TW97.end.y) / 2.0;
      return obj;
    });

    callback(null, data);
  }

  request(this.url, function(err, res, body) {
    if (!err && res.statusCode == 200) {
      filter(JSON.parse(body).result.results)
    } else {
      callback(err);
    }
  });


}


module.exports = VD;
