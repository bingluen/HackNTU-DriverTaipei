var fs = require('fs-extra');
var path = require('path');
var moment = require('moment');

var APICatcher = function() {
  var Parking = require('./modules/catch_parking');
  var Gas = require('./modules/catch_gas');
  var Construct = require('./modules/catch_construct');
  var Pbs = require('./modules/catch_pbs');
  var VD = require('./modules/catch_vd');
  var TimeInterval = {
    parking: 10 * 60 * 1000,
    gas: 7 * 24 * 60 * 60 * 1000,
    construct: 10 * 60 * 1000,
    pbs: 5 * 60 * 1000,
  }

  var filePath = {
    parking: path.join(__dirname, 'database', 'parking.json'),
    gas: path.join(__dirname, 'database', 'gas.json'),
    construct: path.join(__dirname, 'database', 'construct.json'),
    pbs: path.join(__dirname, 'database', 'pbs.json'),
    log: path.join(__dirname, 'log', moment().format('YYYY-MM-DD-h-mm-ss-') + 'log_error_catcher.log')
  }

  var logfile = fs.createOutputStream(filePath.log);

  var writeLogfile = function(messages, type) {
    var t = type || 'other';
    logfile.write(moment().format('[yyyy-mm-dd h:m:ss]') + '[' + t + ']' + messages + '\n');
  }

  var parkingData = new Parking();
  var gasData = new Gas();
  var constructData = new Construct();
  var pbsData = new Pbs();

  var catchingTask = {
    parking: function() {
      parkingData.catching(function(err, data) {
        if (!err) {
          data.updateTime = moment().format('yyyy-MM-dd hh-mm-ss');
          fs.outputJSON(filePath.parking, data, function(err) {
            writeLogfile(err, 'fail to write parking data to json file.')
          })
        } else {
          writeLogfile(err, 'fail to catching parking data.')
        }
      })
    },

    gas: function() {
      gasData.catching(function(err, data) {
        if (!err) {
          data.updateTime = moment().format('yyyy-MM-dd hh-mm-ss');
          fs.outputJSON(filePath.gas, data, function(err) {
            writeLogfile(err, 'fail to write gas data to json file.')
          })
        } else {
          writeLogfile(err, 'fail to catching gas data.')
        }
      })
    },

    construct: function () {
      constructData.catching(function(err, data) {
        if (!err) {
          data.updateTime = moment().format('yyyy-MM-dd hh-mm-ss');
          fs.outputJSON(filePath.construct, data, function(err) {
            writeLogfile(err, 'fail to write construct data to json file.')
          })
        } else {
          writeLogfile(err, 'fail to catching construct data.')
        }
      })
    },

    pbs: function() {
      pbsData.catching(function(err, data) {
        if (!err) {
          data.updateTime = moment().format('yyyy-MM-dd hh-mm-ss');
          fs.outputJSON(filePath.pbs, data, function(err) {
            writeLogfile(err, 'fail to write pbs data to json file.')
          })
        } else {
          writeLogfile(err, 'fail to catching pbs data.')
        }
      })
    }

  }

  catchingTask.parking();
  catchingTask.gas();
  catchingTask.construct();
  catchingTask.pbs();

  setInterval(catchingTask.parking, TimeInterval.parking);
  setInterval(catchingTask.gas, TimeInterval.gas)
  setInterval(catchingTask.construct, TimeInterval.construct)
  setInterval(catchingTask.pbs, TimeInterval.pbs)

}

module.exports = APICatcher;
