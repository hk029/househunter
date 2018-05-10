const express = require('express')
const database = require('../mongo.js').Database;

var db = new database();

db.openDb('localhost', 'rocky');
db.setSchema();

const router = express.Router()



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
  console.log(regs);
  db.findAll('beijing',regs,start,pagesize,doc=>{
    res.send({count:doc.length,data:doc});
  });
})
router.get('/getCount/beijing/:keyword', function (req, res) {
  var regx = req.params.keyword.split('&');
  db.getCount('beijing',regx,doc=>{
    res.send({totalcount:doc});
  });
})

router.get('/getCount/hangzhou/:keyword', function (req, res) {
  var regx = req.params.keyword.split('&');
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
