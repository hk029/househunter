var fs = require('fs');
var mongoose = require('mongoose')



class Database {
  constructor() {
    this.schema = undefined;
    this.model0 = undefined;
    this.model_tmp = undefined;
    this.tmp = 'housetmp';
    this.cur = 'house1';
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
      source: String
    };
    this.schema = new mongoose.Schema(tmp);
    this.model = mongoose.model(this.cur, this.schema);
    // 所有的添加操作都是在tmp上操作（重复数据很多），只有在去重的时候，才把tmp的数据更新到主集合中
    this.model_tmp = mongoose.model(this.tmp, this.schema);
    return this.schema;
  }

  addSchema(obj) {
    this.schema.add(obj);
  }

  delDoc(conditions) {
    this.model_tmp.remove(conditions).exec();
  }

  save(docs) {
    this.model_tmp.create(docs).then(doc => {
      // console.log(doc);
    }).catch(err => console.error(err));
  }

  findOne(reg, callback) { // 寻找
    this.model.findOne({
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
  findAll(reg,start, max, callback) { // 寻找特定网站的ns记录
    // 返回所有文档的的ns和url字段
    var max = max || 30;
    var and = [];
    reg.forEach(function(pre){
      return and.push({"$or":[{name:{$regex:new RegExp(pre,'g')}},{content:{$regex:new RegExp(pre,'g')}}]})
    })
    // console.log(reg,JSON.stringify(and));
    // { $and:[{"$or": [{ name: { $regex: "滨江" } }, { content: { $regex: "滨江" } }] },{"$or": [{ name: { $regex: "滨江" } }, { content: { $regex: "滨江" } }] }]}
    // this.model.find({ "$or": [{ name: { $regex: reg } }, { content: { $regex: reg } }] }, {
    this.model.find({$and:and}, {
      _id: 0
    }).skip(start).limit(max).sort({date:-1}).exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    });
  }
  getCount(reg,callback){
    var and = [];
    reg.forEach(function(pre){
      return and.push({"$or":[{name:{$regex:new RegExp(pre,'g')}},{content:{$regex:new RegExp(pre,'g')}}]})
    })
    this.model.find({$and:and}, {
      _id: 0
    }).count().exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    });
  }

  removeDul(){
    var that = this;
    this.model_tmp.aggregate(
      [
            {
                  $group:{
                        // 这里指定了name和sex为联合主键，相当于去重
                        _id: {name: "$name"},
                        name: {$push: "$name"},
                        content: {$push: "$content"},
                        imgs: {$push: "$imgs"},
                        url: {$push: "$url"},
                        source: {$push: "$source"},
                        price: {$push: "$price"},
                        date: {$push: "$date"},
                  }
            }
      ],function(err,doc){
        // console.log(doc.length);
        var newtemp = [];
        // console.log(doc)
        doc.forEach(ele => {
          newtemp.push({
            name:ele.name[0],
            content:ele.content[0],
            source:ele.source[0],
            price:ele.price[0],
            date:ele.date[0],
            url:ele.url[0],
            imgs:ele.imgs[0]
          })
        });
        that.model.remove({},function(err){});
        that.model.create(newtemp);
        that.delDoc({});
      }
    )
  }
}




exports.Database = Database;
