var express = require('express');
var router = express.Router();
var ErrorHandle = require('../modules/error_handle');


var Parking = require('../modules/catch_parking');
var Gas = require('../modules/catch_gas');
var Construct = require('../modules/catch_construct');
var Pbs = require('../modules/catch_pbs');

//parking sapce
router.get('/parking', function(req, res, next) {
  var parkingData = new Parking();
  parkingData.catching(function(err, data) {
    if(err) {
      var errorhandle = new ErrorHandle(err);
      errorhandle.do();
      return
    } else {
      res.status(200).json(data);
    }
  })
});


//gas station
router.get('/gas', function(req, res, next) {
  var gasData = new Gas();
  gasData.catching(function(err, data) {
    if(err) {
      var errorhandle = new ErrorHandle(err);
      errorhandle.do();
    } else {
      res.status(200).json(data);
    }
  })
});

//construct
router.get('/construct', function(req, res, next) {
  var constructData = new Construct();
  constructData.catching(function(err, data) {
    if(err) {
      var errorhandle = new ErrorHandle(err);
      errorhandle.do();
    } else {
      res.status(200).json(data);
    }
  });
})

router.get('/pbs', function(req, res, next) {
  var pbsData = new Pbs();
  pbsData.catch(function(err, data) {
    if(err) {
      var errorhandle = new ErrorHandle(err);
      errorhandle.do();
    } else {
      res.status(200).json(data);
    }
  })
})

module.exports = router;
