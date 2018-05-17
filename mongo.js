var fs = require('fs');
var mongoose = require('mongoose')



class Database {
  constructor(tmp) {
    this.schema = undefined;
    this.schema_area = undefined;
    this.model0 = undefined;
    // this.models.tmp = undefined;
    this.model_area = undefined;
    this.model_keywords = undefined;
    this.models = [];
    this.names = ['beijing', 'hangzhou', 'tmp'];
    this.tmp = tmp || 'housetmp';
    this.cur = 'house1';
    this.beijing = 'beijing';
    this.area = 'area';
    this.keywords = 'keywords';
  }
  openDb(address, db, option) {
    var option = option; //mongodb连接
    mongoose.connect('mongodb://' + address + '/' + db, option, function (err) {
      console.error(err);
    });
  };

  setSchema(schema) { // Schema主要用于定义MongoDB中集合Collection里文档document的结构
    var tmp = schema || { // 定义结构
      url: String,
      imgs: Array,
      content: String,
      name: String,
      date: String,
      price: Number,
      source: String,
      city: String
    };
    this.schema = new mongoose.Schema(tmp);
    this.schema_area = new mongoose.Schema({
      city: String,
      gb: String,
      area: Object
    });
    this.names.forEach(name => {
      if (typeof this.models[name] === 'undefined') {
        this.models[name] = mongoose.model(name, this.schema);
      }
    })
    // this.model = mongoose.model(this.cur, this.schema);
    // // 所有的添加操作都是在tmp上操作（重复数据很多），只有在去重的时候，才把tmp的数据更新到主集合中
    // this.models.tmp = mongoose.model(this.tmp, this.schema);
    this.model_area = mongoose.model(this.area, this.schema_area);
    this.model_keywords = mongoose.model(this.keywords, new mongoose.Schema({
      keywords: String,
      count: Number
    }))
    return this.schema;
  }

  addSchema(obj) {
    this.schema.add(obj);
  }

  delDoc(conditions) {
    this.models.tmp.remove(conditions).exec();
  }

  save(docs) {
    this.models.tmp.create(docs).then(doc => {
      // console.log(doc);
    }).catch(err => console.error(err));
  }

  saveKeywords(docs) {
    this.model_keywords.create(docs).then(doc => {
      // console.log(doc);
    }).catch(err => console.error(err));
  }

  saveArea(docs) {
    this.model_area.create(docs).then(doc => {
      // console.log(doc);
    }).catch(err => console.error(err));

  }

  findOne(city, reg, callback) { // 寻找
    this.models[city].findOne({
      "$or": [{
        name: {
          $regex: reg
        }
      }, {
        content: {
          $regex: reg
        }
      }]
    }, {
      _id: 0
    }).exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    })
  }
  findAll(city, reg, start, max, callback) {
    var max = max || 30;
    var and = [];
    reg.forEach(function (pre) {
      return and.push({
        "$or": [{
          name: {
            $regex: new RegExp(pre, 'g')
          }
        }, {
          content: {
            $regex: new RegExp(pre, 'g')
          }
        }]
      })
    })
    console.log(JSON.stringify(and));
    this.models[city].find({
      $and: and
    }, {
      _id: 0
    }).skip(start).limit(max).sort({
      date: -1
    }).exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    });
  }
  getCount(city, reg, callback) {
    var and = [];
    reg.forEach(function (pre) {
      return and.push({
        "$or": [{
          name: {
            $regex: new RegExp(pre, 'g')
          }
        }, {
          content: {
            $regex: new RegExp(pre, 'g')
          }
        }]
      })
    })
    this.models[city].find({
      $and: and
    }, {
      _id: 0
    }).count().exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    });
  }
  getArea(city, callback) {
    this.model_area.find({
      city
    }, {
      _id: 0
    }).exec(callback)
  }

  removeDul() {
    var that = this;

    function setAgg(city) {
      that.models.tmp.aggregate(
        [{
          $match: {
            city: city
          }
        }, {
          $group: {
            // 这里指定了name和sex为联合主键，相当于去重
            _id: {
              name: "$name"
            },
            name: {
              $push: "$name"
            },
            content: {
              $push: "$content"
            },
            imgs: {
              $push: "$imgs"
            },
            url: {
              $push: "$url"
            },
            source: {
              $push: "$source"
            },
            price: {
              $push: "$price"
            },
            date: {
              $push: "$date"
            },
          }
        }],
        function (err, doc) {
          var newtemp = [];
          doc.forEach(ele => {
            newtemp.push({
              city: city,
              name: ele.name[0],
              content: ele.content[0],
              source: ele.source[0],
              price: ele.price[0],
              date: ele.date[0],
              url: ele.url[0],
              imgs: ele.imgs[0]
            })
          });
          that.models[city].remove({}, function (err) {});
          that.models[city].create(newtemp);
        })
    }
    setAgg('beijing')
    setAgg('hangzhou')
    this.delDoc({});
  }
}




exports.Database = Database;



function saveDoc() {
  var de = JSON.parse(fs.readFileSync('./dis.json'));
  var db = new Database();
  db.openDb('localhost', 'rocky');
  db.setSchema({
    city: String,
    gb: String,
    area: Object
  });

  var data = [
    'bj',
    'hz'
  ]

  var name = {
    'bj': '北京',
    'hz': '杭州'
  }

  console.log(de);
  function getd(data) {
    var docs = [];
    data.forEach(n => {
      docs.push({
        city: n,
        gb: name[n],
        area: de[n]
      })
    })
    return docs;
  }

  db.saveArea(getd(data));
  console.log('succ')
}

// saveDoc();
