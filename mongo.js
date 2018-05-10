var fs = require('fs');
var mongoose = require('mongoose')



class Database {
  constructor(tmp) {
    this.schema = undefined;
    this.schema_area = undefined;
    this.model0 = undefined;
    // this.models.tmp = undefined;
    this.model_area = undefined;
    this.models = [];
    this.names = ['beijing','hangzhou','tmp'];
    this.tmp = tmp||'housetmp' ;
    this.cur = 'house1';
    this.beijing = 'beijing'
    this.area = 'area'
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
      city:String
    };
    this.schema = new mongoose.Schema(tmp);
    this.schema_area = new mongoose.Schema({
      city:String,
      gb:String,
      area:Object
    });
    this.names.forEach(name=>{
      this.models[name] = mongoose.model(name,this.schema);
    })
    // this.model = mongoose.model(this.cur, this.schema);
    // // 所有的添加操作都是在tmp上操作（重复数据很多），只有在去重的时候，才把tmp的数据更新到主集合中
    // this.models.tmp = mongoose.model(this.tmp, this.schema);
    this.model_area = mongoose.model(this.area, this.schema_area);
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
  saveArea(docs){
    this.model_area.create(docs).then(doc => {
      // console.log(doc);
    }).catch(err => console.error(err));

  }

  findOne(city,reg, callback) { // 寻找
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
  findAll(city,reg,start, max, callback) {
    var max = max || 30;
    var and = [];
    reg.forEach(function(pre){
      return and.push({"$or":[{name:{$regex:new RegExp(pre,'g')}},{content:{$regex:new RegExp(pre,'g')}}]})
    })
   this.models[city].find({$and:and}, {
      _id: 0
    }).skip(start).limit(max).sort({date:-1}).exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    });
  }
  getCount(city,reg,callback){
    var and = [];
    reg.forEach(function(pre){
      return and.push({"$or":[{name:{$regex:new RegExp(pre,'g')}},{content:{$regex:new RegExp(pre,'g')}}]})
    })
   this.models[city].find({$and:and}, {
      _id: 0
    }).count().exec(function (err, doc) {
      if (err) console.error(err);
      callback(doc);
    });
  }
  getArea(city,callback){
    this.model_area.find({city},{_id:0}).exec(callback)
  }

  removeDul(){
    var that = this;
    function setAgg(city){
      that.models.tmp.aggregate(
        [ { $match:{ city:city }}, {$group:{
                          // 这里指定了name和sex为联合主键，相当于去重
                          _id: {name: "$name"},
                          name: {$push: "$name"},
                          content: {$push: "$content"},
                          imgs: {$push: "$imgs"},
                          url: {$push: "$url"},
                          source: {$push: "$source"},
                          price: {$push: "$price"},
                          date: {$push: "$date"},
                    } }
        ],function(err,doc){
          var newtemp = [];
          doc.forEach(ele => {
            newtemp.push({
              city:city,
              name:ele.name[0],
              content:ele.content[0],
              source:ele.source[0],
              price:ele.price[0],
              date:ele.date[0],
              url:ele.url[0],
              imgs:ele.imgs[0]
            })
          });
          that.models[city].remove({},function(err){});
          that.models[city].create(newtemp);
        })
      }
      setAgg('beijing')
      setAgg('hangzhou')
    }
          // that.delDoc({});
}




exports.Database = Database;



function saveDoc(){

var db = new Database();

db.openDb('localhost', 'rocky');
db.setSchema({
  city:String,
  gb:String,
  area:Object
});

var data = [
  'beijing',
  'hangzhou'
]

var name={
  'beijing':'北京',
  'hangzhou':'杭州'
}

var region ={
  'beijing':[{"value":"不限","label":"不限"},{"value":"朝阳","label":"朝阳"},{"value":"海淀","label":"海淀"},{"value":"丰台","label":"丰台"},{"value":"东城","label":"东城"},{"value":"西城","label":"西城"},{"value":"石景山","label":"石景山"},{"value":"昌平","label":"昌平"},{"value":"大兴","label":"大兴"},{"value":"通州","label":"通州"},{"value":"顺义","label":"顺义"},{"value":"房山","label":"房山"},{"value":"密云","label":"密云"},{"value":"门头沟","label":"门头沟"},{"value":"怀柔","label":"怀柔"},{"value":"延庆","label":"延庆"},{"value":"平谷","label":"平谷"},{"value":"燕郊","label":"燕郊"},{"value":"北京周边","label":"北京周边"},{"value":"旅游地产","label":"旅游地产"}],
  'hangzhou':[{"value":"不限","label":"不限"},{"value":"西湖","label":"西湖"},{"value":"江干","label":"江干"},{"value":"余杭","label":"余杭"},{"value":"滨江","label":"滨江"},{"value":"下城","label":"下城"},{"value":"上城","label":"上城"},{"value":"拱墅","label":"拱墅"},{"value":"萧山","label":"萧山"},{"value":"富阳","label":"富阳"},{"value":"临安","label":"临安"},{"value":"淳安","label":"淳安"},{"value":"桐庐","label":"桐庐"},{"value":"建德","label":"建德"},{"value":"杭州周边","label":"杭州周边"}]
}
var subway ={
  'beijing': [{"label":"1号线","value":"1号线","children":[{"label":"苹果园站","value":"苹果园站"},{"label":"古城站","value":"古城站"},{"label":"八角游乐园站","value":"八角游乐园站"},{"label":"八宝山站","value":"八宝山站"},{"label":"玉泉路站","value":"玉泉路站"},{"label":"五棵松站","value":"五棵松站"},{"label":"万寿路站","value":"万寿路站"},{"label":"公主坟站","value":"公主坟站"},{"label":"军事博物馆站","value":"军事博物馆站"},{"label":"木樨地站","value":"木樨地站"},{"label":"南礼士路站","value":"南礼士路站"},{"label":"复兴门站","value":"复兴门站"},{"label":"西单站","value":"西单站"},{"label":"天安门西站","value":"天安门西站"},{"label":"天安门东站","value":"天安门东站"},{"label":"王府井站","value":"王府井站"},{"label":"东单站","value":"东单站"},{"label":"建国门站","value":"建国门站"},{"label":"永安里站","value":"永安里站"},{"label":"国贸站","value":"国贸站"},{"label":"大望路站","value":"大望路站"},{"label":"四惠站","value":"四惠站"},{"label":"四惠东站","value":"四惠东站"}]},{"label":"6号线","value":"6号线","children":[{"label":"海淀五路居站","value":"海淀五路居站"},{"label":"慈寿寺站","value":"慈寿寺站"},{"label":"花园桥站","value":"花园桥站"},{"label":"白石桥南站","value":"白石桥南站"},{"label":"车公庄西站","value":"车公庄西站"},{"label":"车公庄站","value":"车公庄站"},{"label":"平安里站","value":"平安里站"},{"label":"北海北站","value":"北海北站"},{"label":"南锣鼓巷站","value":"南锣鼓巷站"},{"label":"东四站","value":"东四站"},{"label":"朝阳门站","value":"朝阳门站"},{"label":"东大桥站","value":"东大桥站"},{"label":"呼家楼站","value":"呼家楼站"},{"label":"金台路站","value":"金台路站"},{"label":"十里堡站","value":"十里堡站"},{"label":"青年路站","value":"青年路站"},{"label":"褡裢坡站","value":"褡裢坡站"},{"label":"黄渠站","value":"黄渠站"},{"label":"常营站","value":"常营站"},{"label":"草房站","value":"草房站"},{"label":"物资学院路站","value":"物资学院路站"},{"label":"通州北关站","value":"通州北关站"},{"label":"北运河西站","value":"北运河西站"},{"label":"东夏园站","value":"东夏园站"},{"label":"潞城站","value":"潞城站"}]},{"label":"7号线","value":"7号线","children":[{"label":"北京西站","value":"北京西站"},{"label":"湾子站","value":"湾子站"},{"label":"达官营站","value":"达官营站"},{"label":"广安门内站","value":"广安门内站"},{"label":"菜市口站","value":"菜市口站"},{"label":"虎坊桥站","value":"虎坊桥站"},{"label":"珠市口站","value":"珠市口站"},{"label":"桥湾站","value":"桥湾站"},{"label":"磁器口站","value":"磁器口站"},{"label":"广渠门内站","value":"广渠门内站"},{"label":"广渠门外站","value":"广渠门外站"},{"label":"九龙山站","value":"九龙山站"},{"label":"大郊亭站","value":"大郊亭站"},{"label":"百子湾站","value":"百子湾站"},{"label":"化工站","value":"化工站"},{"label":"南楼梓庄站","value":"南楼梓庄站"},{"label":"欢乐谷景区站","value":"欢乐谷景区站"},{"label":"双合站","value":"双合站"},{"label":"焦化厂站","value":"焦化厂站"}]},{"label":"9号线","value":"9号线","children":[{"label":"郭公庄站","value":"郭公庄站"},{"label":"丰台科技园站","value":"丰台科技园站"},{"label":"科怡路站","value":"科怡路站"},{"label":"丰台南路站","value":"丰台南路站"},{"label":"丰台东大街站","value":"丰台东大街站"},{"label":"七里庄站","value":"七里庄站"},{"label":"六里桥站","value":"六里桥站"},{"label":"六里桥东站","value":"六里桥东站"},{"label":"北京西站","value":"北京西站"},{"label":"军事博物馆站","value":"军事博物馆站"},{"label":"白堆子站","value":"白堆子站"},{"label":"白石桥南站","value":"白石桥南站"},{"label":"国家图书馆站","value":"国家图书馆站"}]},{"label":"房山线","value":"房山线","children":[{"label":"郭公庄站","value":"郭公庄站"},{"label":"大葆台站","value":"大葆台站"},{"label":"稻田站","value":"稻田站"},{"label":"长阳站","value":"长阳站"},{"label":"篱笆房站","value":"篱笆房站"},{"label":"广阳城站","value":"广阳城站"},{"label":"良乡大学城北站","value":"良乡大学城北站"},{"label":"良乡大学城站","value":"良乡大学城站"},{"label":"良乡大学城西站","value":"良乡大学城西站"},{"label":"良乡南关站","value":"良乡南关站"},{"label":"苏庄站","value":"苏庄站"}]},{"label":"14号线","value":"14号线","children":[{"label":"张郭庄站","value":"张郭庄站"},{"label":"园博园站","value":"园博园站"},{"label":"大瓦窑站","value":"大瓦窑站"},{"label":"郭庄子站","value":"郭庄子站"},{"label":"大井站","value":"大井站"},{"label":"七里庄站","value":"七里庄站"},{"label":"西局站","value":"西局站"},{"label":"北京南站","value":"北京南站"},{"label":"永定门外站","value":"永定门外站"},{"label":"景泰站","value":"景泰站"},{"label":"蒲黄榆站","value":"蒲黄榆站"},{"label":"方庄路站","value":"方庄路站"},{"label":"十里河站","value":"十里河站"},{"label":"北京工业大学站","value":"北京工业大学站"},{"label":"九龙山站","value":"九龙山站"},{"label":"大望路站","value":"大望路站"},{"label":"红庙站","value":"红庙站"},{"label":"金台路站","value":"金台路站"},{"label":"朝阳公园站","value":"朝阳公园站"},{"label":"枣营站","value":"枣营站"},{"label":"东风北桥站","value":"东风北桥站"},{"label":"将台站","value":"将台站"},{"label":"望京南站","value":"望京南站"},{"label":"阜通站","value":"阜通站"},{"label":"望京站","value":"望京站"},{"label":"东湖渠站","value":"东湖渠站"},{"label":"来广营站","value":"来广营站"},{"label":"善各庄站","value":"善各庄站"}]},{"label":"机场线","value":"机场线","children":[{"label":"东直门站","value":"东直门站"},{"label":"三元桥站","value":"三元桥站"},{"label":"2号航站楼站","value":"2号航站楼站"},{"label":"3号航站楼站","value":"3号航站楼站"}]},{"label":"大兴线","value":"大兴线","children":[{"label":"天宫院站","value":"天宫院站"},{"label":"生物医药基地站","value":"生物医药基地站"},{"label":"义和庄站","value":"义和庄站"},{"label":"黄村火车站","value":"黄村火车站"},{"label":"黄村西大街站","value":"黄村西大街站"},{"label":"清源路站","value":"清源路站"},{"label":"枣园站","value":"枣园站"},{"label":"高米店南站","value":"高米店南站"},{"label":"高米店北站","value":"高米店北站"},{"label":"西红门站","value":"西红门站"},{"label":"新宫站","value":"新宫站"}]},{"label":"亦庄线","value":"亦庄线","children":[{"label":"宋家庄站","value":"宋家庄站"},{"label":"肖村站","value":"肖村站"},{"label":"小红门站","value":"小红门站"},{"label":"旧宫站","value":"旧宫站"},{"label":"亦庄桥站","value":"亦庄桥站"},{"label":"亦庄文化园站","value":"亦庄文化园站"},{"label":"万源街站","value":"万源街站"},{"label":"荣京东街站","value":"荣京东街站"},{"label":"荣昌东街站","value":"荣昌东街站"},{"label":"同济南路站","value":"同济南路站"},{"label":"经海路站","value":"经海路站"},{"label":"次渠南站","value":"次渠南站"},{"label":"次渠站","value":"次渠站"},{"label":"亦庄火车站","value":"亦庄火车站"}]},{"label":"16号线","value":"16号线","children":[{"label":"北安河站","value":"北安河站"},{"label":"温阳路站","value":"温阳路站"},{"label":"稻香湖路站","value":"稻香湖路站"},{"label":"屯佃站","value":"屯佃站"},{"label":"永丰站","value":"永丰站"},{"label":"永丰南站","value":"永丰南站"},{"label":"西北旺站","value":"西北旺站"},{"label":"马连洼站","value":"马连洼站"},{"label":"西苑站","value":"西苑站"}]},{"label":"昌平线","value":"昌平线","children":[{"label":"西二旗站","value":"西二旗站"},{"label":"生命科学园站","value":"生命科学园站"},{"label":"朱辛庄站","value":"朱辛庄站"},{"label":"巩华城站","value":"巩华城站"},{"label":"沙河站","value":"沙河站"},{"label":"沙河高教园站","value":"沙河高教园站"},{"label":"南邵站","value":"南邵站"}]},{"label":"15号线","value":"15号线","children":[{"label":"清华东路西口站","value":"清华东路西口站"},{"label":"六道口站","value":"六道口站"},{"label":"北沙滩站","value":"北沙滩站"},{"label":"奥林匹克公园站","value":"奥林匹克公园站"},{"label":"安立路站","value":"安立路站"},{"label":"大屯路东站","value":"大屯路东站"},{"label":"关庄站","value":"关庄站"},{"label":"望京西站","value":"望京西站"},{"label":"望京站","value":"望京站"},{"label":"望京东站","value":"望京东站"},{"label":"崔各庄站","value":"崔各庄站"},{"label":"马泉营站","value":"马泉营站"},{"label":"孙河站","value":"孙河站"},{"label":"国展站","value":"国展站"},{"label":"花梨坎站","value":"花梨坎站"},{"label":"后沙峪站","value":"后沙峪站"},{"label":"南法信站","value":"南法信站"},{"label":"石门站","value":"石门站"},{"label":"顺义站","value":"顺义站"},{"label":"俸伯站","value":"俸伯站"}]},{"label":"2号线","value":"2号线","children":[{"label":"西直门站","value":"西直门站"},{"label":"积水潭站","value":"积水潭站"},{"label":"鼓楼大街站","value":"鼓楼大街站"},{"label":"安定门站","value":"安定门站"},{"label":"雍和宫站","value":"雍和宫站"},{"label":"东直门站","value":"东直门站"},{"label":"东四十条站","value":"东四十条站"},{"label":"朝阳门站","value":"朝阳门站"},{"label":"建国门站","value":"建国门站"},{"label":"北京站","value":"北京站"},{"label":"崇文门站","value":"崇文门站"},{"label":"前门站","value":"前门站"},{"label":"和平门站","value":"和平门站"},{"label":"宣武门站","value":"宣武门站"},{"label":"长椿街站","value":"长椿街站"},{"label":"复兴门站","value":"复兴门站"},{"label":"阜成门站","value":"阜成门站"},{"label":"车公庄站","value":"车公庄站"}]},{"label":"4号线","value":"4号线","children":[{"label":"公益西桥站","value":"公益西桥站"},{"label":"角门西站","value":"角门西站"},{"label":"马家堡站","value":"马家堡站"},{"label":"北京南站","value":"北京南站"},{"label":"陶然亭站","value":"陶然亭站"},{"label":"菜市口站","value":"菜市口站"},{"label":"宣武门站","value":"宣武门站"},{"label":"西单站","value":"西单站"},{"label":"灵境胡同站","value":"灵境胡同站"},{"label":"西四站","value":"西四站"},{"label":"平安里站","value":"平安里站"},{"label":"新街口站","value":"新街口站"},{"label":"西直门站","value":"西直门站"},{"label":"动物园站","value":"动物园站"},{"label":"国家图书馆站","value":"国家图书馆站"},{"label":"魏公村站","value":"魏公村站"},{"label":"人民大学站","value":"人民大学站"},{"label":"海淀黄庄站","value":"海淀黄庄站"},{"label":"中关村站","value":"中关村站"},{"label":"北京大学东门站","value":"北京大学东门站"},{"label":"圆明园站","value":"圆明园站"},{"label":"西苑站","value":"西苑站"},{"label":"北宫门站","value":"北宫门站"},{"label":"安河桥北站","value":"安河桥北站"}]},{"label":"5号线","value":"5号线","children":[{"label":"宋家庄站","value":"宋家庄站"},{"label":"刘家窑站","value":"刘家窑站"},{"label":"蒲黄榆站","value":"蒲黄榆站"},{"label":"天坛东门站","value":"天坛东门站"},{"label":"磁器口站","value":"磁器口站"},{"label":"崇文门站","value":"崇文门站"},{"label":"东单站","value":"东单站"},{"label":"灯市口站","value":"灯市口站"},{"label":"东四站","value":"东四站"},{"label":"张自忠路站","value":"张自忠路站"},{"label":"北新桥站","value":"北新桥站"},{"label":"雍和宫站","value":"雍和宫站"},{"label":"和平里北街站","value":"和平里北街站"},{"label":"和平西桥站","value":"和平西桥站"},{"label":"惠新西街南口站","value":"惠新西街南口站"},{"label":"惠新西街北口站","value":"惠新西街北口站"},{"label":"大屯路东站","value":"大屯路东站"},{"label":"北苑路北站","value":"北苑路北站"},{"label":"立水桥南站","value":"立水桥南站"},{"label":"立水桥站","value":"立水桥站"},{"label":"天通苑南站","value":"天通苑南站"},{"label":"天通苑站","value":"天通苑站"},{"label":"天通苑北站","value":"天通苑北站"}]},{"label":"8号线","value":"8号线","children":[{"label":"朱辛庄站","value":"朱辛庄站"},{"label":"育知路","value":"育知路"},{"label":"平西府站","value":"平西府站"},{"label":"回龙观东大街站","value":"回龙观东大街站"},{"label":"霍营站","value":"霍营站"},{"label":"育新站","value":"育新站"},{"label":"西小口站","value":"西小口站"},{"label":"永泰庄站","value":"永泰庄站"},{"label":"林萃桥站","value":"林萃桥站"},{"label":"森林公园南门站","value":"森林公园南门站"},{"label":"奥林匹克公园站","value":"奥林匹克公园站"},{"label":"奥体中心站","value":"奥体中心站"},{"label":"北土城站","value":"北土城站"},{"label":"安华桥站","value":"安华桥站"},{"label":"安德里北街站","value":"安德里北街站"},{"label":"鼓楼大街站","value":"鼓楼大街站"},{"label":"什刹海站","value":"什刹海站"},{"label":"南锣鼓巷站","value":"南锣鼓巷站"}]},{"label":"10号线","value":"10号线","children":[{"label":"巴沟站","value":"巴沟站"},{"label":"苏州街站","value":"苏州街站"},{"label":"海淀黄庄站","value":"海淀黄庄站"},{"label":"知春里站","value":"知春里站"},{"label":"知春路站","value":"知春路站"},{"label":"西土城站","value":"西土城站"},{"label":"牡丹园站","value":"牡丹园站"},{"label":"健德门站","value":"健德门站"},{"label":"北土城站","value":"北土城站"},{"label":"安贞门站","value":"安贞门站"},{"label":"惠新西街南口站","value":"惠新西街南口站"},{"label":"芍药居站","value":"芍药居站"},{"label":"太阳宫站","value":"太阳宫站"},{"label":"三元桥站","value":"三元桥站"},{"label":"亮马桥站","value":"亮马桥站"},{"label":"农业展览馆站","value":"农业展览馆站"},{"label":"团结湖站","value":"团结湖站"},{"label":"呼家楼站","value":"呼家楼站"},{"label":"金台夕照站","value":"金台夕照站"},{"label":"国贸站","value":"国贸站"},{"label":"双井站","value":"双井站"},{"label":"劲松站","value":"劲松站"},{"label":"潘家园站","value":"潘家园站"},{"label":"十里河站","value":"十里河站"},{"label":"分钟寺站","value":"分钟寺站"},{"label":"成寿寺站","value":"成寿寺站"},{"label":"宋家庄站","value":"宋家庄站"},{"label":"石榴庄站","value":"石榴庄站"},{"label":"大红门站","value":"大红门站"},{"label":"角门东站","value":"角门东站"},{"label":"角门西站","value":"角门西站"},{"label":"草桥站","value":"草桥站"},{"label":"纪家庙站","value":"纪家庙站"},{"label":"首经贸站","value":"首经贸站"},{"label":"丰台站","value":"丰台站"},{"label":"泥洼站","value":"泥洼站"},{"label":"西局站","value":"西局站"},{"label":"六里桥站","value":"六里桥站"},{"label":"莲花桥站","value":"莲花桥站"},{"label":"公主坟站","value":"公主坟站"},{"label":"西钓鱼台站","value":"西钓鱼台站"},{"label":"慈寿寺站","value":"慈寿寺站"},{"label":"车道沟站","value":"车道沟站"},{"label":"长春桥站","value":"长春桥站"},{"label":"火器营站","value":"火器营站"}]},{"label":"13号线","value":"13号线","children":[{"label":"西直门站","value":"西直门站"},{"label":"大钟寺站","value":"大钟寺站"},{"label":"知春路站","value":"知春路站"},{"label":"五道口站","value":"五道口站"},{"label":"上地站","value":"上地站"},{"label":"西二旗站","value":"西二旗站"},{"label":"龙泽站","value":"龙泽站"},{"label":"回龙观站","value":"回龙观站"},{"label":"霍营站","value":"霍营站"},{"label":"立水桥站","value":"立水桥站"},{"label":"北苑站","value":"北苑站"},{"label":"望京西站","value":"望京西站"},{"label":"芍药居站","value":"芍药居站"},{"label":"光熙门站","value":"光熙门站"},{"label":"柳芳站","value":"柳芳站"},{"label":"东直门站","value":"东直门站"}]},{"label":"八通线","value":"八通线","children":[{"label":"四惠站","value":"四惠站"},{"label":"四惠东站","value":"四惠东站"},{"label":"高碑店站","value":"高碑店站"},{"label":"传媒大学站","value":"传媒大学站"},{"label":"双桥站","value":"双桥站"},{"label":"管庄站","value":"管庄站"},{"label":"八里桥站","value":"八里桥站"},{"label":"通州北苑站","value":"通州北苑站"},{"label":"果园站","value":"果园站"},{"label":"九棵树站","value":"九棵树站"},{"label":"梨园站","value":"梨园站"},{"label":"临河里站","value":"临河里站"},{"label":"土桥站","value":"土桥站"}]}]  ,
  'hangzhou':[{"label":"1号线","value":"1号线","children":[{"value":"湘湖站","label":"湘湖站"},{"value":"滨康路站","label":"滨康路站"},{"value":"西兴站","label":"西兴站"},{"value":"滨和路站","label":"滨和路站"},{"value":"江陵路站","label":"江陵路站"},{"value":"近江站","label":"近江站"},{"value":"婺江路站","label":"婺江路站"},{"value":"城站","label":"城站"},{"value":"定安路站","label":"定安路站"},{"value":"龙翔桥站","label":"龙翔桥站"},{"value":"凤起路站","label":"凤起路站"},{"value":"武林广场站","label":"武林广场站"},{"value":"西湖文化广场站","label":"西湖文化广场站"},{"value":"打铁关站","label":"打铁关站"},{"value":"闸弄口站","label":"闸弄口站"},{"value":"火车东站","label":"火车东站"},{"value":"彭埠站","label":"彭埠站"},{"value":"七堡站","label":"七堡站"},{"value":"九和路站","label":"九和路站"},{"value":"九堡站","label":"九堡站"},{"value":"客运中心站","label":"客运中心站"},{"value":"下沙西站","label":"下沙西站"},{"value":"金沙湖站","label":"金沙湖站"},{"value":"高沙路站","label":"高沙路站"},{"value":"文泽路站","label":"文泽路站"},{"value":"文海南路","label":"文海南路"},{"value":"云水站","label":"云水站"},{"value":"下沙江滨站","label":"下沙江滨站"},{"value":"乔司南站","label":"乔司南站"},{"value":"乔司站","label":"乔司站"},{"value":"翁梅站","label":"翁梅站"},{"value":"余杭高铁站","label":"余杭高铁站"},{"value":"南苑站","label":"南苑站"},{"value":"临平站","label":"临平站"}]},{"label":"9号线","value":"9号线","children":[{"value":"昌达路站","label":"昌达路站"},{"value":"新洲路站","label":"新洲路站"},{"value":"北沙路站","label":"北沙路站"},{"value":"邱山大街站","label":"邱山大街站"},{"value":"临平站","label":"临平站"},{"value":"南苑站","label":"南苑站"},{"value":"余杭高铁站","label":"余杭高铁站"},{"value":"翁梅站","label":"翁梅站"},{"value":"乔司站","label":"乔司站"},{"value":"乔司南站","label":"乔司南站"},{"value":"客运中心站","label":"客运中心站"},{"value":"艮山东路站","label":"艮山东路站"},{"value":"七堡老街站","label":"七堡老街站"},{"value":"五堡站","label":"五堡站"},{"value":"御道站","label":"御道站"},{"value":"三堡站","label":"三堡站"},{"value":"渔人码头站","label":"渔人码头站"},{"value":"钱江路站","label":"钱江路站"},{"value":"四季青站","label":"四季青站"}]},{"label":"2号线","value":"2号线","children":[{"value":"朝阳站","label":"朝阳站"},{"value":"曹家桥站","label":"曹家桥站"},{"value":"潘水站","label":"潘水站"},{"value":"人民路站","label":"人民路站"},{"value":"杭发厂站","label":"杭发厂站"},{"value":"人民广场","label":"人民广场"},{"value":"建设一路站","label":"建设一路站"},{"value":"建设三路站","label":"建设三路站"},{"value":"振宁路站","label":"振宁路站"},{"value":"飞虹路站","label":"飞虹路站"},{"value":"盈丰路站","label":"盈丰路站"},{"value":"钱江世纪城","label":"钱江世纪城"},{"value":"钱江路站","label":"钱江路站"}]},{"label":"10号线","value":"10号线","children":[{"value":"浙大站","label":"浙大站"},{"value":"玉古路站","label":"玉古路站"},{"value":"学院路站","label":"学院路站"},{"value":"隐秀路站","label":"隐秀路站"},{"value":"翠柏路站","label":"翠柏路站"},{"value":"莫干山路站","label":"莫干山路站"},{"value":"汽车北站站","label":"汽车北站站"},{"value":"国际会展中心站","label":"国际会展中心站"},{"value":"祥园路站","label":"祥园路站"},{"value":"杭行路站","label":"杭行路站"},{"value":"吴家路站","label":"吴家路站"},{"value":"新兴路站","label":"新兴路站"}]},{"label":"7号线","value":"7号线","children":[{"value":"人民路站","label":"人民路站"},{"value":"吴山广场站","label":"吴山广场站"},{"value":"江城路站","label":"江城路站"},{"value":"城站站","label":"城站站"},{"value":"四季青站","label":"四季青站"},{"value":"市民中心站","label":"市民中心站"},{"value":"奥体站","label":"奥体站"},{"value":"建设四路站","label":"建设四路站"},{"value":"明星路站","label":"明星路站"},{"value":"建设三路站","label":"建设三路站"},{"value":"耕文路站","label":"耕文路站"},{"value":"新城路站","label":"新城路站"},{"value":"高新路站","label":"高新路站"},{"value":"合欢路站","label":"合欢路站"},{"value":"新街站","label":"新街站"},{"value":"红垦站","label":"红垦站"},{"value":"萧山机场站","label":"萧山机场站"},{"value":"靖江站","label":"靖江站"},{"value":"义蓬站","label":"义蓬站"},{"value":"塘新线站","label":"塘新线站"},{"value":"青六路站","label":"青六路站"},{"value":"北二路站","label":"北二路站"},{"value":"江东二路站","label":"江东二路站"}]},{"label":"8号线","value":"8号线","children":[{"value":"文海南路站","label":"文海南路站"},{"value":"河庄站","label":"河庄站"},{"value":"河景路站","label":"河景路站"},{"value":"青六路站","label":"青六路站"},{"value":"青蓬路站","label":"青蓬路站"},{"value":"新湾站","label":"新湾站"},{"value":"江东站","label":"江东站"}]},{"label":"6号线","value":"6号线","children":[{"value":"双浦站","label":"双浦站"},{"value":"河山路站","label":"河山路站"},{"value":"凤凰公园站","label":"凤凰公园站"},{"value":"美院象山站","label":"美院象山站"},{"value":"枫桦西路站","label":"枫桦西路站"},{"value":"之江海洋公园站","label":"之江海洋公园站"},{"value":"振浦路站","label":"振浦路站"},{"value":"中医药大学站","label":"中医药大学站"},{"value":"伟业路站","label":"伟业路站"},{"value":"公建中心站","label":"公建中心站"},{"value":"建业路站","label":"建业路站"},{"value":"长河路站","label":"长河路站"},{"value":"江汉路站","label":"江汉路站"},{"value":"江陵路站","label":"江陵路站"},{"value":"星民站","label":"星民站"},{"value":"奥体站","label":"奥体站"},{"value":"博览站","label":"博览站"},{"value":"钱江世纪城站","label":"钱江世纪城站"},{"value":"丰北站","label":"丰北站"}]},{"label":"4号线","value":"4号线","children":[{"value":"近江站","label":"近江站"},{"value":"城星路站","label":"城星路站"},{"value":"市民中心站","label":"市民中心站"},{"value":"江锦路站","label":"江锦路站"},{"value":"钱江路站","label":"钱江路站"},{"value":"景芳站","label":"景芳站"},{"value":"新塘站","label":"新塘站"},{"value":"新风站","label":"新风站"},{"value":"火车东站","label":"火车东站"},{"value":"彭埠站","label":"彭埠站"}]},{"label":"3号线","value":"3号线","children":[{"value":"文一西路站","label":"文一西路站"},{"value":"绿汀路站","label":"绿汀路站"},{"value":"良睦路站","label":"良睦路站"},{"value":"高教园路站","label":"高教园路站"},{"value":"荆常大道站","label":"荆常大道站"},{"value":"百家园路站","label":"百家园路站"},{"value":"花坞路站","label":"花坞路站"},{"value":"汽车西站站","label":"汽车西站站"},{"value":"古墩路站","label":"古墩路站"},{"value":"古荡新村站","label":"古荡新村站"},{"value":"玉古路站","label":"玉古路站"},{"value":"松木场站","label":"松木场站"},{"value":"武林门站","label":"武林门站"},{"value":"武林广场站","label":"武林广场站"},{"value":"西湖文化广场站","label":"西湖文化广场站"},{"value":"潮王路站","label":"潮王路站"},{"value":"香积寺路站","label":"香积寺路站"},{"value":"大关站","label":"大关站"},{"value":"沈半路站","label":"沈半路站"},{"value":"东新路站","label":"东新路站"},{"value":"康宁站","label":"康宁站"},{"value":"华丰路站","label":"华丰路站"},{"value":"同协路站","label":"同协路站"},{"value":"笕桥路站","label":"笕桥路站"},{"value":"五号路站","label":"五号路站"},{"value":"天丰路站","label":"天丰路站"},{"value":"天都城站","label":"天都城站"},{"value":"星桥站","label":"星桥站"}]},{"label":"5号线","value":"5号线","children":[{"value":"科技岛站","label":"科技岛站"},{"value":"创新路站","label":"创新路站"},{"value":"中央公园站","label":"中央公园站"},{"value":"仓前站","label":"仓前站"},{"value":"杭师大站","label":"杭师大站"},{"value":"常二路站","label":"常二路站"},{"value":"五常站","label":"五常站"},{"value":"蒋村站","label":"蒋村站"},{"value":"浙大紫金港站","label":"浙大紫金港站"},{"value":"三坝站","label":"三坝站"},{"value":"益乐路站","label":"益乐路站"},{"value":"莫干山路站","label":"莫干山路站"},{"value":"巨州路站","label":"巨州路站"},{"value":"上塘路站","label":"上塘路站"},{"value":"沈半路站","label":"沈半路站"},{"value":"再行路站","label":"再行路站"},{"value":"东新园站","label":"东新园站"},{"value":"城市之星站","label":"城市之星站"},{"value":"打铁关站","label":"打铁关站"},{"value":"宝善桥站","label":"宝善桥站"},{"value":"建国北路站","label":"建国北路站"},{"value":"平海路站","label":"平海路站"},{"value":"城站站","label":"城站站"},{"value":"江城路站","label":"江城路站"},{"value":"候潮路站","label":"候潮路站"},{"value":"南星桥站","label":"南星桥站"},{"value":"长河路站","label":"长河路站"},{"value":"江虹路西站","label":"江虹路西站"},{"value":"江晖路站","label":"江晖路站"},{"value":"滨康路站","label":"滨康路站"},{"value":"青年路站","label":"青年路站"},{"value":"金鸡路站","label":"金鸡路站"},{"value":"人民广场站","label":"人民广场站"},{"value":"育才路站","label":"育才路站"},{"value":"通惠路站","label":"通惠路站"},{"value":"新城路站","label":"新城路站"},{"value":"香樟路站","label":"香樟路站"}]}]
}
function getd(data){
  var docs = [];
  data.forEach(n=>{
    docs.push({
      city:n,
      gb:name[n],
      area:[
        {
          value:'region',
          label:'区域',
          children:region[n]
        },
        {
          value:'subway',
          label:'地铁',
          children:subway[n]
        }
      ]
    })
  })
  return docs;
}

db.saveArea(getd(data));
console.log('succ')
}

// saveDoc();
