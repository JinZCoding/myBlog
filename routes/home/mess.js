var express = require('express');
var router = express.Router();

var objectId = require("mongodb").ObjectID;

// 数据库
var mongoClient = require('mongodb').MongoClient;
var db_url = "mongodb://127.0.0.1:27017/myblog";

/* GET home page. */
router.get('/', function (req, res, next) {
    mongoClient.connect(db_url, function (err, db) {
        if (err) throw err;
        var mess = db.collection("mess");
        // 查找当前文章详情
        mess.find().toArray(function (err, docs) {
            if (err) throw err;

            res.render('home/messageBoard', { msgs: docs });
        });
        db.close();
    });
});

// 添加留言
router.post('/publish', function (req, res, next) {
    //console.log(req.body);
    // var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;
    var date = new Date();
    var msg = {
        // title: title,
        author: author,
        content: content,
        date: date,
    };
    // console.log(post);
    mongoClient.connect(db_url, function (err, db) {
        if (err) throw err;
        var mess = db.collection("mess");
        mess.insert(msg, function (err, result) {
            if (err) throw err;
            console.log("留言成功");
            // 添加成功返回列表页(网页重定向)
            res.redirect('/mess');
        });
        db.close();
    });
});

module.exports = router;
