var request = require('request');
var async = require('async');
var CoordinateTransforms = require('../helper/CoordinateTransform');
var fs = require('fs-extra');
var path = require('path');
var moment = require('moment');

var logfileName = 'log_parking.log';

var Parking = function() {
  this.url = {
    //parking: "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=fe6767ec-9732-4bc9-b051-0990087c708d",
    parking: "http://data.taipei.gov.tw/opendata/apply/query/QzhBMEJFOTctMEEzRC00M0Q2LThDNDktNDVCNDc3NDNDRDBC?$format=json",
    available: "http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=9ba187c9-b07e-40bc-9aa5-8d3c9f1aad63"
  };
  this.logfile = fs.createOutputStream(path.join(__dirname, '../log', moment().format('YYYY-MM-DD-h-mm-ss-') + logfileName));
}

Parking.prototype.writeLogfile = function (messages, type) {

  this.logfile.write('[' + Date(Date.now()).toString() + ']' + (type ? '['+ type +']' : '') + messages + '\n');

};


Parking.prototype.catching = function(next) {

  async.parallel({
    parkingData: function(callback) {
      this.writeLogfile('start to catching parking data');
      request(this.url.parking, function(err, res, body) {
        this.writeLogfile('catched parking data');
        if (body.length <= 0) {

          var err = {
            message: 'Cant\'t catch data.',
            statusCode: 500
          }
          this.writeLogfile('Cant\'t catch parking data.', 'error');
          callback(err)

        } else if(!err && res.statusCode == 200) {
          callback(null, JSON.parse(body));
        } else {
          callback(err)
        }
      }.bind(this))
    }.bind(this)
  },

  function(err, results) {
    console.log(results);
    if(!err) {
      // 刪除無用的欄位
      var parkingData = results['parkingData'].map(function(currentValue) {
        var obj = {}
        var latlng = CoordinateTransforms.TW97_WGS84(currentValue.tw97x, currentValue.tw97y)
        obj.id = currentValue.id;
        obj.name = currentValue.name;
        obj.lat = latlng.y;
        obj.lng = latlng.x;
        obj.availableCar = (parseInt(currentValue.availableCar) > 0 ? parseInt(currentValue.availableCar) : 0);
        obj.availableMotor = (parseInt(currentValue.availableMotor) > 0 ? parseInt(currentValue.availableMotor) : 0);
        obj.payDes = currentValue.payex;
        return obj;
      });


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
