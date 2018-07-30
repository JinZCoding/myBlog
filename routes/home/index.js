var express = require('express');
var router = express.Router();

// 数据库
var mongoClient = require('mongodb').MongoClient;
var db_url = "mongodb://127.0.0.1:27017/myblog";

/* GET home page. */
router.get('/', function (req, res, next) {
  mongoClient.connect(db_url, function (err, db) {
    if (err) throw err;
    var carts = db.collection("carts");
    carts.find().toArray(function (err, result1) {
      if (err) throw err;
      var posts = db.collection("posts");
      posts.find().toArray(function (err, result2) {
        if (err) throw err;
        //console.log(result1,result2);
        res.render('home/index', { data1: result1, data2: result2 });
      });
      db.close();
    });
  });
  // res.render('home/index');
});

module.exports = router;
