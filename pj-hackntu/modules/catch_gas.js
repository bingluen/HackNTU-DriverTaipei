var request = require('request');

var CoordinateTransforms = require('../helper/CoordinateTransform');

var gas = function () {
  this.url = "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=a8fd6811-ab29-40dd-9b92-383e8ebd2a4e"
}


gas.prototype.catching = function(next) {
  var filter = function(data) {
    var gasData = data.map(function(currentValue) {
      var obj = {}
      var latlng = CoordinateTransforms.TW97_WGS84(currentValue.ADDR_X, currentValue.ADDR_Y);
      obj.id = currentValue._id;
      obj.name = currentValue.NAME;
      obj.lat = latlng.y;
      obj.lng = latlng.x;
      obj.hasOil = currentValue.HAVEOIL == 'Y' ? true : false;
      obj.hasSelf = currentValue.HAVESELF == 'Y' ? true : false;
      obj.hasGas = currentValue.NAME.match('加氣') == null ? false : true;
      obj.serviceTime = timeTransfrom(currentValue.DUTY_TIME);
      return obj;
    });

    next(null, gasData);
  }

  var timeTransfrom = function(timeString) {
    if ( typeof timeString != 'string' ) {
        return 'null';
    }

    timeString = timeString.replace(/[^-~0-9]/g, '');
    timeString = timeString.split(/[-~]/g);
    timeString = timeString.map(function(currentValue) {
      return parseInt(currentValue) >= 24 ? '24:00' :
              ( parseInt(currentValue) > 10 ? parseInt(currentValue) + ':00' : '0' + parseInt(currentValue) + ':00' ) ;
    })
    if (parseInt(timeString[0].slice(0, 2)) < 24) {
      return timeString[0] + ' ~ ' + timeString[1];
    } else {
      return '00:00 ~ ' + timeString[0];
    }

  }

  request(this.url, function(err, res, body) {
    if(!err) {
      filter(JSON.parse(body).result.results)
    } else {
      next(err);
    }
  });
}

module.exports = gas;
