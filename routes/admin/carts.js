var express = require('express');
var router = express.Router();
var objectId = require("mongodb").ObjectID;

// 数据库
var mongoClient = require('mongodb').MongoClient;
var db_url = "mongodb://127.0.0.1:27017/myblog";

/* GET users listing. */
router.get('/', function(req, res, next) {
    // res.render('admin/category_list');
    mongoClient.connect(db_url, function(err, db){
        if(err) throw err;
        // console.log("数据库连接成功");
        var carts = db.collection("carts");

        carts.find().toArray(function(err, result){
            if(err) throw err;
            res.render('admin/category_list',{data: result});
        });
        db.close();
    });
});

router.get('/add', function(req, res, next) {
    res.render('admin/category_add');
});
// 编辑
router.get('/edit', function(req, res, next) {
    // 获取数据
    var id = req.query.id;
    // console.log(id);
    
    mongoClient.connect(db_url, function(err, db){
        if(err) throw err;
        // console.log("数据库连接成功");
        var carts = db.collection("carts");
        // 条件查找（_id）
        carts.find({_id: objectId(id)}).toArray(function(err, result){
            if(err) throw err;
            // console.log(result);
            //向页面传递获取的值
            res.render('admin/category_edit',{data: result[0]});
        });
        db.close();
    });
    
    //res.render('admin/category_edit');
});

//添加数据
router.post('/add', function(req, res, next){
    var data = req.body;
    var title = data.title;
    var sort = data.sort;
    mongoClient.connect(db_url, function(err, db){
        if(err) throw err;
        // console.log("数据库连接成功");
        var carts = db.collection("carts");
        carts.insert({title: title, sort: sort}, function(err, result){
            if(err) throw err;
            console.log("添加成功！");
            // 添加成功返回列表页(网页重定向)
            res.redirect('/admin/carts');

        });
        db.close();
    });
   
});

//编辑修改内容
router.post('/edit', function(req, res, next){
    var data = req.body;
    var title = data.title;
    var sort = data.sort;
    var id = data.id;
    // console.log("...............................");
    mongoClient.connect(db_url, function(err, db){
        if(err) throw err;
        //console.log("数据库连接成功");
        var carts = db.collection("carts");
        carts.update({_id:objectId(id)},{$set:{'title': title, 'sort':sort}},function(err, result){
            if(err) throw err;
            res.redirect('/admin/carts');
        });
        db.close();
    });
   
});

// 删除
router.get('/del', function(req, res, next){
    // get请求要用query获取
    var id = req.query.id;
    console.log(id);
    // console.log("............");
    mongoClient.connect(db_url, function(err, db){
        if(err) throw err;
        var carts = db.collection("carts");
        carts.remove({_id:objectId(id)},function(err, result){
            if(err) throw err;
            // 网页重定向
            res.redirect('/admin/carts');
        });
        db.close();
    });
});

module.exports = router;