const express = require('express')
const database = require('../mongo.js').Database;

var db = new database();

db.openDb('localhost', 'rocky');
db.setSchema();

const router = express.Router()

router.get('/getData/:name', function (req, res) {
  var regs = req.params.name.split('&');
  var query = req.query;
  var start = Number(query.start)||0;
  var pagesize = Number(query.pagesize)||30;
  db.findAll(regs,start,pagesize,doc=>{
    res.send({count:doc.length,data:doc});
  });
})

router.get('/getCount/:name', function (req, res) {
  var regx = new RegExp(req.params.name,'g');
  db.getCount(regx,doc=>{
    res.send({totalcount:doc});
  });
})

router.get('/api/douban',function(req,res){
  var query = req.query;

  db.findAll(/滨江/,start,30,doc=>{
    // console.log(doc);
    res.send({count:doc.length,data:doc});
  });
});


// app.get('/api/html',function(req,res){
//   res.sendFile(__dirname+'/mock/test.html');
// });

module.exports = router
