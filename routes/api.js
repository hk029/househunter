const express = require('express')
const database = require('../mongo.js').Database;
const fs = require('fs');

var db = new database();

db.openDb('localhost', 'rocky');
db.setSchema();

const router = express.Router()


var keywords = JSON.parse(fs.readFileSync('./keywords.json'));
var times = 0;

router.get('/getData/hangzhou/:keyword', function (req, res) {
  // var city = req.params.city;
  var query = req.query;
  var regs = req.params.keyword.split('&');
  var start = Number(query.start)||0;
  var pagesize = Number(query.pagesize)||30;
  console.log(regs);
  db.findAll('hangzhou',regs,start,pagesize,doc=>{
    res.send({count:doc.length,data:doc});
  });
})

router.get('/getData/beijing/:keyword', function (req, res) {
  // var city = req.params.city;
  var query = req.query;
  var regs = req.params.keyword.split('&');
  var start = Number(query.start)||0;
  var pagesize = Number(query.pagesize)||30;
  // console.log(regs);
  db.findAll('beijing',regs,start,pagesize,doc=>{
    res.send({count:doc.length,data:doc});
  });
})

router.get('/getCount/beijing/:keyword', function (req, res) {
  var regx = req.params.keyword.split('&');
  times = (times + 1)%100;
  regx.forEach(key => {
    if(keywords[key]){
      keywords[key]++;
    } else {
      keywords[key] = 1;
    }
  });
  if(times%10 === 0){
    fs.writeFile('../keywords.json',JSON.stringify(keywords))
  }
  db.getCount('beijing',regx,doc=>{
    res.send({totalcount:doc});
  });
})

router.get('/getCount/hangzhou/:keyword', function (req, res) {
  var regx = req.params.keyword.split('&');
  times = (times + 1)%100;
  regx.forEach(key => {
    if(keywords[key]){
      keywords[key]++;
    } else {
      keywords[key] = 1;
    }
  });
  if(times%10 === 0){
    fs.writeFile('./keywords.json',JSON.stringify(keywords))
  }
  db.getCount('hangzhou',regx,doc=>{
    res.send({totalcount:doc});
  });
})

router.get('/getArea/:city', function (req, res) {
  db.getArea(req.params.city,(err,doc)=>{
    if(err){
      res.send({err})
    }else {
      res.send(doc[0]);
    }
  });
})



// app.get('/api/html',function(req,res){
//   res.sendFile(__dirname+'/mock/test.html');
// });

module.exports = router
