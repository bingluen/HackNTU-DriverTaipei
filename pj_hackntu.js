/* Module */
var express = require('express');

/* Project module */
var ErrorHandle = require('./pj-hackntu/modules/error_handle');
var API = require('./pj-hackntu/router/api.js')

/* setting app */
var app = express();

app.use('/api', API);



// catch 404 and forward to error handler
// next 疑似是擺好看的，官方文件沒說什麼東東會被傳進來
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  var errorHandle = ErrorHandle(err);
  errorhandle.do(req, res);
});

module.exports = app;
