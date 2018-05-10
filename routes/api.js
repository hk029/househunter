const express = require('express')
const database = require('../mongo.js').Database;

var db = new database();

db.openDb('localhost', 'rocky');
db.setSchema();

const router = express.Router()

router.get('/getData/:city', function (req, res) {
  var city = req.params.city;
  var query = req.query;
  var regs = query.keyword.split('&');
  var start = Number(query.start)||0;
  var pagesize = Number(query.pagesize)||30;
  db.findAll(city,regs,start,pagesize,doc=>{
    res.send({count:doc.length,data:doc});
  });
})

router.get('/getCount/:city', function (req, res) {
  var city = req.params.city;
  var regx = req.query.keyword.split('&');
  db.getCount(city,regx,doc=>{
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
