const express = require('express');
var appData = require('./mock/douban.json')

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');


var app = express();
app.use('/',express.static(__dirname+"/dist"));
app.use("*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next();
  }
})
// app.use('/', indexRouter);
app.use('/api', apiRouter);




app.listen(80);
console.log('listen on http://localhost:80')
