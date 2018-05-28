var request = require('request');
var cheerio = require('cheerio')
var fs = require("fs")
var iconv = require('iconv-lite');

var dist = JSON.parse(fs.readFileSync('dist.json'));
var sels = JSON.parse(fs.readFileSync('./select.json'));


function get5i5j(city) {
  // get all list
  request.get('https://' + city + '.5i5j.com/zufang/subway/', function (err, res, body) {
    var $ = cheerio.load(body);
    var list = [];
    var trs = $('ul.new_di_tab a');
    var tmpdis = {};
    trs.each(function (idx, ele) {
      var name = $(ele).text().trim();
      var href = $(ele).attr('href');
      distract[name] = href;
      tmpdis[name] = href;
      console.log(name)
    })
    var text = JSON.stringify(dist);
    fs.writeFileSync('dist.json', text);
    console.log(JSON.stringify(tmpdis))
    for (var name in tmpdis) {
      var url = tmpdis[name];
      urls.push(url);
    }
    urls.reduce(function (seq, url) {
      return seq.then(getPromise(url, city));
    }, Promise.resolve());
    // Promise.reduce(urls,function(pre,cur){
    //   getPromise(pre,city).then()
    // })
    // pros.reduce((pre, cur) => pre.then(cur()), );
    // console.log(pros);

  });
}



function getPromise(urlbase, url, trs_a, parent_a, getSelect,opt) {
  // return function () {
  return new Promise(function (resolve, rej) {
    // request.get(urlbase,'https://' + city + '.5i5j.com' + url, function (err, res, body) {
    request({'url':urlbase + url,encoding:null,gzip:opt.gzip}, function (err, res, body) {
      if (err) {
        rej(0);
      }

      console.log(urlbase+url,parent_a)
      var buf = body;
      if (opt.code) {
        buf = iconv.decode(body, 'gb2312').toString();
      }
      var $ = cheerio.load(buf);
      var list = [];
      // var trs = $('.quyuCon a');
      var trs = $(trs_a);
      var parent = $(parent_a);
      // console.log(buf);
      // var parent = $('ul.new_di_tab .new_di_tab_cur');
      console.log(parent.text().trim())
      trs.each(function (idx, ele) {
        var name = $(ele).text().trim();
        var href = $(ele).attr('href');
        distract[name] = href;
        list.push({
          'value': name,
          'label': name
        })
      })
      if (getSelect) {
        sels[parent.text().trim()] = {
          'label': parent.text().trim(),
          'value': parent.text().trim(),
          children: list
        };
        fs.writeFileSync('./select.json', JSON.stringify(sels));
      }
      var text = JSON.stringify(dist);
      fs.writeFileSync('dist.json', text);
      resolve(distract);
    })
  })
  // }
}

function get58(city) {
  // get all list
  request.get('https://' + city + '.58.com/chuzu/sub/', function (err, res, body) {
    var $ = cheerio.load(body);
    var list = [];
    var trs = $('.secitem.secitem_fist>dd>a');
    var tmpdis = {};
    trs.each(function (idx, ele) {
      var name = $(ele).text().trim();
      var href = $(ele).attr('href');
      distract[name] = href;
      tmpdis[name] = href;
      console.log(name)
    })
    var text = JSON.stringify(dist);
    fs.writeFileSync('dist.json', text);
    console.log(JSON.stringify(tmpdis))
    for (var name in tmpdis) {
      var url = tmpdis[name];
      urls.push(url);
    }
    urls.reduce(function (seq, url) {
      return seq.then(getPromise58(url, city));
    }, Promise.resolve());
  });
}

function getData(urlbase, curpath, selector, opt) {
  var trs_a = selector.tr;
  var list_a = selector.list;
  var parent_a = selector.parent;
  request({'url':urlbase + '/'+curpath,encoding:null,gize:opt.gzip}, function (err, res, body) {
    console.log(urlbase + '/' + curpath, trs_a);
    var buf = body.toString();
    if (opt.code) {
      buf = iconv.decode(body, 'gb2312').toString();
    }
    var $ = cheerio.load(buf);
    console.log(buf)
    var list = [];
    var trs = $(trs_a);
    var tmpdis = {};
    trs.each(function (idx, ele) {
      var name = $(ele).text().trim();
      var href = $(ele).attr('href');
      if(href.indexOf('java')>=0){href = '/'}
      distract[name] = href;
      tmpdis[name] = href;
      console.log(name)
    })
    var text = JSON.stringify(dist);
    fs.writeFileSync('dist.json', text);
    console.log(JSON.stringify(tmpdis))
    for (var name in tmpdis) {
      var url = tmpdis[name];
      urls.push(url);
    }
    urls.reduce(function (seq, url) {
      return seq.then(getPromise(urlbase, url, list_a, parent_a, false, opt));
    }, Promise.resolve());
  });
}

// function getPromise()
function getPromise58(url, city) {
  // return function () {
  return new Promise(function (resolve, rej) {
    request.get('https://' + city + '.58.com' + url, function (err, res, body) {
      if (err) {
        rej(0);
      }
      var $ = cheerio.load(body);
      var list = {};
      var trs = $('.arealist a');
      var ck = dist['5i5j'][city];
      var parent = $('.secitem_fist>dd>a.select');
      // console.log(parent.text().trim())
      trs.each(function (idx, ele) {
        var name = $(ele).text().trim();
        var href = $(ele).attr('href');
        if (ck[name]) {
          distract[name] = href;
        } else {
          list[name] = href;
        }
      })
      var text = JSON.stringify(dist);
      fs.writeFileSync('dist.json', text);
      console.log(parent.text().trim(), JSON.stringify(list));
      // fs.writeFileSync('./select.json', JSON.stringify(sels));
      resolve(distract);
    })
  })
  // }
}

function obj2arr(obj) {
  var tmp = []
  for (var i in obj) {
    tmp.push(obj[i]);
  }
  return tmp;
}
// var text = JSON.stringify(obj2arr(sels));fs.writeFileSync('./select.json', text);
// get58(curcity);


var city = 'bj'
var site = '房天下'
var fist = true;
// var first = false;

if (!dist[site]) {
  dist[site] = {
    'hz': {},
    'bj': {}
  };
}

var distract = dist[site][city];
var urls = [];
var sels = {};

getData(`http://zu.fang.com`, `/`, {
  tr: '#rentid_D04_01 a',
  list: '#rentid_D04_08 a',
  parent: '.org.selected'
},{gzip:false})
// }, {code:'gb2312',gzip:false})


// request({'url':'http://zu.hz.fang.com/house-a0161/',encoding:'gb2312'}, function (err, res, body) {
//   if (err) {
//     rej(0);
//   }
//   var buf = body;
//   console.log(body)
//     // buf = iconv.decode(body, 'utf-8').toString();

//   // console.log(buf)
// })

// request({
//   encoding: null,
//   url: 'http://zu.hz.fang.com/',
//   gzip:true
// }, function(error, response, body) {
//   if (!error && response.statusCode == 200) {
//       console.log(iconv.decode(body, 'gb2312').toString());
//   }
// });
