const database = require('../mongo.js').Database;

var db = new database();

db.openDb('localhost', 'rocky');
db.setSchema();

var list = [{"name":"不限","type":"region","city":"beijing"},{"name":"朝阳","type":"region","city":"beijing"},{"name":"海淀","type":"region","city":"beijing"},{"name":"丰台","type":"region","city":"beijing"},{"name":"东城","type":"region","city":"beijing"},{"name":"西城","type":"region","city":"beijing"},{"name":"石景山","type":"region","city":"beijing"},{"name":"昌平","type":"region","city":"beijing"},{"name":"大兴","type":"region","city":"beijing"},{"name":"通州","type":"region","city":"beijing"},{"name":"顺义","type":"region","city":"beijing"},{"name":"房山","type":"region","city":"beijing"},{"name":"密云","type":"region","city":"beijing"},{"name":"门头沟","type":"region","city":"beijing"},{"name":"怀柔","type":"region","city":"beijing"},{"name":"延庆","type":"region","city":"beijing"},{"name":"平谷","type":"region","city":"beijing"},{"name":"燕郊","type":"region","city":"beijing"},{"name":"北京周边","type":"region","city":"beijing"},{"name":"旅游地产","type":"region","city":"beijing"}]
