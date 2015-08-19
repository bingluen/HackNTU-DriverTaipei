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
      console.log('catching parking');
      request(this.url.parking, function(err, res, body) {
        if(!err && res.statusCode == 200) {
          callback(null, JSON.parse(body).result.results);
        } else {
          callback(err)
        }
      })
    }.bind(this),


    availableSpace: function(callback) {
      console.log('catching available space');
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
        obj.id = currentValue.id;
        obj.area = currentValue.area;
        obj.name = currentValue.name;
        obj.summary = currentValue.summary;
        obj.address = currentValue.address;
        obj.tel = currentValue.tel;
        obj.payex = currentValue.payex;
        obj.serviceTime = currentValue.serviceTime
        obj.totalCar = currentValue.totalCar;
        obj.totalBike = currentValue.totalBike;
        obj.latlng = CoordinateTransforms.TW97_WGS84(currentValue.tw97x, currentValue.tw97y);
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
          parkingData[i].availableCar = availableParking[parkingData[i].id].availableCar || 'null';
          parkingData[i].availableMotor = availableParking[parkingData[i].id].availableMotor || 'null';
        } else {
          parkingData[i].availableCar = 'null';
          parkingData[i].availableMotor = 'null';
        }
      }


      next(null, parkingData);
    } else {
      next(err)
    }
  }
  );
}

module.exports = Parking;
