var request = require('request');
var async = require('async');
var CoordinateTransforms = require('../helper/CoordinateTransform');

var Parking = function() {
  this.url = {
    parking: "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=fe6767ec-9732-4bc9-b051-0990087c708d",
    available: "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=9ba187c9-b07e-40bc-9aa5-8d3c9f1aad63"
  };
}


Parking.prototype.catching = function(next) {

  async.parallel({
    parkingData: function(callback) {
      request(this.url.parking, function(err, res, body) {
        if(!err && res.statusCode == 200) {
          callback(null, JSON.parse(body).result.results);
        } else {
          callback(err)
        }
      })
    }.bind(this),


    availableSpace: function(callback) {
      request(this.url.available, function(err, res, body) {
        if(!err && res.statusCode == 200) {
          callback(null, JSON.parse(body).result.results);
        } else {
          callback(err)
        }
      })
    }.bind(this)
  },

  function(err, results) {
    if(!err) {
      // 刪除無用的欄位
      var parkingData = results['parkingData'].map(function(currentValue) {
        var obj = {}
        var latlng = CoordinateTransforms.TW97_WGS84(currentValue.tw97x, currentValue.tw97y)
        obj.id = currentValue.id;
        obj.name = currentValue.name;
        obj.lat = latlng.y;
        obj.lng = latlng.x;
        obj.payDes = currentValue.payex;
        return obj;
      });

      // before merge refactor available parking space array to object
      var availableParking = {}
      for(var i = 0 ; i < results['availableSpace'].length; i ++) {
        availableParking[results['availableSpace'][i].id] = {
          availableCar: (results['availableSpace'][i].availableCar > 0 ? results['availableSpace'][i].availableCar : 0),
          availableMotor: (results['availableSpace'][i].availableMotor > 0 ? results['availableSpace'][i].availableMotor : 0)
        }
      }

      // merge available parking space by loop
      for(var i = 0; i < parkingData.length; i ++) {
        if(availableParking[parkingData[i].id]) {
          parkingData[i].availableCar = availableParking[parkingData[i].id].availableCar || 0;
          parkingData[i].availableMotor = availableParking[parkingData[i].id].availableMotor || 0;
        } else {
          parkingData[i].availableCar = 0;
          parkingData[i].availableMotor = 0;
        }
      }

      // filte data (delete data which availableParking = zero)
      parkingData = parkingData.filter(function(element) {
        return (element.availableCar + element.availableMotor > 0);
      });


      next(null, parkingData);
    } else {
      next(err)
    }
  }
  );
}

module.exports = Parking;
