/* Module */
var express = require('express');

/* Project module */
var ErrorHandle = require('./pj-hackntu/modules/error_handle');

/* setting app */
var app = express();



// catch 404 and forward to error handler
// next 疑似是擺好看的，官方文件沒說什麼東東會被傳進來
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  var errorHandle = Errorhandle(err);
  errorHandle.do();
});

module.exports = app;
