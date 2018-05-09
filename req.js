const request = require('request');
const http = require('request-promise');
const database = require('./mongo.js').Database;
const schedule = require('node-schedule')


var db = new database();

db.openDb('localhost', 'rocky');
db.setSchema();


function getPage(url) {
  return new Promise(function (resolve, reject) {
    request
      .get(url, function (err, res, body) {
        if (err) {
          reject(err);
        } else {
          if (res.headers['content-type'].indexOf('json') > 0) {
            // console.log('json')
            resolve({
              type: 'json',
              body: JSON.parse(body)
            })
          } else {
            // console.log('html')
            resolve({
              type: 'html',
              body
            })
          }
        }
      });
  })
}

function resolveDouban(json) {
  var topics = [];
  // console.log(json);
  json.topics.forEach(element => {
    var tmp = {
      url: element.share_url,
      imgs: element.photos,
      content: element.content,
      name: element.title,
      date: element.created,
      price: 0,
      source: '豆瓣'
    };
    if (tmp.imgs) {
      tmp.imgs = tmp.imgs.map(im => {
        im.alt = im.alt.replace(/http.*\/\//g, 'https://images.weserv.nl/?url=');
        return im;
      })
    }
    topics.push(tmp);
  })
  db.save(topics);
  // db.findAll(/下城/,function(err,doc){
  //   console.log(doc);
  // })
  return topics;
}


function main() {
  doJob();
}

function getDouban() {
  var start = 0;
  return function () {
    getPage('https://api.douban.com/v2/group/HZhome/topics?count=100&start=' + start)
      .then(data => {
        console.log('https://api.douban.com/v2/group/HZhome/topics?count=100&start=' + start, data.body.count)
        resolveDouban(data.body);
        getPage('https://api.douban.com/v2/group/145219/topics?count=100&start=' + start)
          .then(data => {
            console.log('https://api.douban.com/v2/group/145219/topics?count=100&start=' + start, data.body.count)
            start = (start + 100) % 1500;
            resolveDouban(data.body);
          }).catch(err => console.error(err));
      }).catch(err => console.error(err));
  }
}

function doJob() {
  // 每60秒爬一次豆瓣（每小时150次的限制）
  setInterval(getDouban(), 120000)
  // 每天小时更新到主服务器上
  var rule = new schedule.RecurrenceRule();
  rule.minute = 10;
  var j2 = schedule.scheduleJob(rule, function () {
    db.removeDul();
  });
}

main();
