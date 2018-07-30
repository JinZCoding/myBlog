var express = require('express');
var router = express.Router();

var objectId = require("mongodb").ObjectID;

// 数据库
var mongoClient = require('mongodb').MongoClient;
var db_url = "mongodb://127.0.0.1:27017/myblog";

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
        res.render('home/article_list', { data1: result1, data2: result2 });
      });
      db.close();
    });
  });
});

/* GET home page. */
router.get('/details', function (req, res, next) {
  var id = req.query.id;
  //console.log(id);
  mongoClient.connect(db_url, function (err, db) {
    if (err) throw err;
    var posts = db.collection("posts");
    // 查找当前文章详情
    posts.find({ _id: objectId(id) }).toArray(function (err, docs) {
      if (err) throw err;
      var carts = db.collection("carts");
      // 查找所有分类
      carts.find().toArray(function (err, result1) {
        if (err) throw err;
        // 所有文章
        posts.find().toArray(function (err, result2) {
          if (err) throw err;
          // console.log(result1,result2);
          res.render('home/article', { data: docs[0], data1: result1, data2: result2 });
        });
        db.close();
      });
    });
  });
});

module.exports = router;
