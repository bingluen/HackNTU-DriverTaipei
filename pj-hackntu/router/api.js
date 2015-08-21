var express = require('express');
var router = express.Router();
var ErrorHandle = require('../modules/error_handle');
var fs = require('fs-extra');
var path = require('path');

var filePath = {
  parking: path.join(__dirname, '../database', 'parking.json'),
  gas: path.join(__dirname, '../database', 'gas.json'),
  construct: path.join(__dirname, '../database', 'construct.json'),
  pbs: path.join(__dirname, '../database', 'pbs.json'),
}


//parking sapce
router.get('/parking', function(req, res, next) {
  fs.readJSON(filePath.parking, function(err, packageObj) {
    if(err) {
      res.status(500).json({
        err: 'fail to getting data',
        statusCode: 500
      })
    } else {
      res.status(200).json(packageObj);
    }
  })
});


//gas station
router.get('/gas', function(req, res, next) {
  fs.readJSON(filePath.gas, function(err, packageObj) {
    if(err) {
      res.status(500).json({
        err: 'fail to getting data',
        statusCode: 500
      })
    } else {
      res.status(200).json(packageObj);
    }
  })
});

//construct
router.get('/construct', function(req, res, next) {
  fs.readJSON(filePath.construct, function(err, packageObj) {
    if(err) {
      res.status(500).json({
        err: 'fail to getting data',
        statusCode: 500
      })
    } else {
      res.status(200).json(packageObj);
    }
  })
})

//PBS
router.get('/pbs', function(req, res, next) {
  fs.readJSON(filePath.pbs, function(err, packageObj) {
    if(err) {
      res.status(500).json({
        err: 'fail to getting data',
        statusCode: 500
      })
    } else {
      res.status(200).json(packageObj);
    }
  })
});

module.exports = router;
