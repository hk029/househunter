var request = require('request');
var cheerio = require('cheerio')
var fs = require("fs")

var curcity = 'bj'
var dist = JSON.parse(fs.readFileSync('dist.json'));
var sels = JSON.parse(fs.readFileSync('./select.json'));
// dist['58同城'] = {'hz':{},'bj':{}};
// dist['5i5j'].hz = {};
// // var sel = JSON.parse(fs.readFileSync('./select.json'));
// dist['5i5j'].hz = {};

var distract = dist['58租房'][curcity];
var urls = [];
var sels = {};

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
    urls.reduce(function(seq,url){
      return seq.then(getPromise(url,city));
    },Promise.resolve());
    // Promise.reduce(urls,function(pre,cur){
    //   getPromise(pre,city).then()
    // })
    // pros.reduce((pre, cur) => pre.then(cur()), );
    // console.log(pros);

  });
}



function getPromise(url, city) {
  // return function () {
    return new Promise(function (resolve, rej) {
      request.get('https://' + city + '.5i5j.com' + url, function (err, res, body) {
        if (err) {
          rej(0);
        }
        var $ = cheerio.load(body);
        var list = [];
        var trs = $('.quyuCon a');
        var parent = $('ul.new_di_tab .new_di_tab_cur');
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
        sels[parent.text().trim()] = {
          'label': parent.text().trim(),
          'value': parent.text().trim(),
          children: list
        };
        var text = JSON.stringify(dist);
        fs.writeFileSync('dist.json', text);
        fs.writeFileSync('./select.json', JSON.stringify(sels));
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
    urls.reduce(function(seq,url){
      return seq.then(getPromise58(url,city));
    },Promise.resolve());
  });
}



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
          if(ck[name]){
            distract[name] = href;
          }
          else {
            list[name] = href;
          }
        })
        var text = JSON.stringify(dist);
        fs.writeFileSync('dist.json', text);
        console.log(parent.text().trim(),JSON.stringify(list));
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
get58(curcity);




// for (var name in distract) {
//   var url = distract[name];
//   urls.push(url);
//   var pros = urls.map(url => getPromise(url));
//   console.log(pros);
// }
// urls = ['sl101/', 'sl2/', 'sl1/', 'sl4/']
// var pros = urls.map(url => getPromise(url));


// var text = `
// <ul class="new_di_tab sTab">
// 						<a href="/zufang/" title="杭州租房">
// 							<li class="">全部<span class="new_icon"></span>
// 							</li>
// 						</a>
// 													<a href="/zufang/gongshuqu/" title="杭州拱墅区租房">
// 								<li class="new_di_tab_cur">拱墅区<span class="new_icon"></span></li>
// 							</a>
// 													<a href="/zufang/xiachengqu/" title="杭州下城区租房">
// 								<li class="">下城区<span class="new_icon"></span></li>
// 							</a>
// 					</ul>
// `
// var $ = cheerio.load(text);
// var list = [];
// var trs = $('ul.new_di_tab a');

// trs.each(function (idx, ele) {

//   console.log($(ele).attr('href'), $(ele).text().trim());
// })
// console.log(trs)
