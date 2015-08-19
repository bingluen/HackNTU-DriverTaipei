var express = require('express');
var router = express.Router();
var ErrorHandle = require('../modules/error_handle');


var Parking = require('../modules/catch_parking')

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


//

module.exports = router;
