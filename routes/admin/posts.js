// var express = require('express');
// var router = express.Router();
var objectId = require("mongodb").ObjectID;
var express = require('express'),
    router = express.Router(),    
    formidable = require('formidable'),
    fs = require('fs'),
    TITLE = '文件上传示例',
    AVATAR_UPLOAD_FOLDER = '/avatar/';

// 数据库
var mongoClient = require('mongodb').MongoClient;
var db_url = "mongodb://127.0.0.1:27017/myblog";

/* GET users listing. */

// 列表
router.get('/', function (req, res, next) {
  mongoClient.connect(db_url, function (err, db) {
    if (err) throw err;
    var posts = db.collection("posts");
    posts.find().toArray(function (err, result) {
      if (err) throw err;
      res.render('admin/article_list', { data: result });
    });
    db.close();
  });

});

// 添加页面显示文章分类
router.get('/add', function (req, res, next) {
  //res.render('admin/article_add');
  mongoClient.connect(db_url, function (err, db) {
    if (err) throw err;
    //console.log("数据库连接成功");
    var carts = db.collection("carts");
    //console.log("hooooooo~");
    carts.find().toArray(function (err, result) {
      if (err) throw err;
      //console.log("yooooooo~");
      res.render('admin/article_add', { data: result });
    });
    db.close();
  });
});

// 添加文章功能
router.post('/add', function (req, res, next) {
  //获取当前时间
  var date = new Date();
  var post;
  // 获取图片地址
  //创建上传表单
  var form = new formidable.IncomingForm();
  //设置编辑
  form.encoding = 'utf-8';
  //设置上传目录
  form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
  //保留后缀
  form.keepExtensions = true;
  //文件大小 2M
  form.maxFieldsSize = 2 * 1024 * 1024;
  var cover;
  // 上传文件的入口文件
  form.parse(req, function (err, fields, files) {
    if (err) throw err;
    var extName = '';  //后缀名
    switch (files.inputCover.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }
    var avatarName = Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;
    fs.renameSync(files.inputCover.path, newPath);  //重命名
    cover = avatarName;

    post = fields;
    post.date = date;
    post.cover = cover;
    // console.log(post);
    mongoClient.connect(db_url, function (err, db) {
      if (err) throw err;
      var posts = db.collection("posts");
      posts.insert(post, function (err, result) {
        if (err) throw err;
        console.log("文章发布成功");
        // 添加成功返回列表页(网页重定向)
        res.redirect('/admin/posts');
      });
      db.close();
    });
  });
});

// 删除
router.get('/del', function (req, res, next) {
  // get请求要用query获取
  var id = req.query.id;
  // console.log(id);
  // console.log("............");
  mongoClient.connect(db_url, function (err, db) {
    if (err) throw err;
    var posts = db.collection("posts");
    posts.remove({ _id: objectId(id) }, function (err, result) {
      if (err) throw err;
      // 网页重定向
      res.redirect('/admin/posts');
    });
    db.close();
  });
});

// 编辑页面显示
router.get('/edit', function (req, res, next) {
  // 获取数据
  var id = req.query.id;
  //console.log(id);
  mongoClient.connect(db_url, function (err, db) {
    if (err) throw err;
    var data1 = [];
    var data2 = [];
    // 获取分类名称
    var carts = db.collection("carts");
    carts.find().toArray(function (err, result) {
      if (err) throw err;
      data1 = result;
      //console.log(result);
    });
    // 获取post信息
    var posts = db.collection("posts");
    posts.find({ _id: objectId(id) }).toArray(function (err, result) {
      if (err) throw err;
      data2 = result[0];
      // console.log(data1);
      // console.log(data2);
      res.render('admin/article_edit', { data1: data1, data2: data2 });

    });

    db.close();
  });
});

// 编辑功能
router.post('/edit', function (req, res, next) {

  var date = new Date();
  var post;
  // 获取图片地址
  //创建上传表单
  var form = new formidable.IncomingForm();
  //设置编辑
  form.encoding = 'utf-8';
  //设置上传目录
  form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;
  //保留后缀
  form.keepExtensions = true;
  //文件大小 2M
  form.maxFieldsSize = 2 * 1024 * 1024;
  
  // 上传文件的入口文件
  form.parse(req, function (err, fields, files) {
    if (err) throw err;
    var extName = '';  //后缀名
    switch (files.inputCover.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }
    var avatarName = Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;
    fs.renameSync(files.inputCover.path, newPath);  //重命名
    var cover = avatarName;
    // 获取表单内容
    post = fields;
    // id这样获得
    id = post.id;
    mongoClient.connect(db_url, function (err, db) {
      if (err) throw err;
      var posts = db.collection("posts");
      posts.update({ _id: objectId(id) },{
        $set: {
          'category_id': post.category_id,
          'subject': post.subject,
          'summary': post.summary,
          'content': post.content,
          'submit': post.submit,
          'date': date,
          'cover': cover
        }
      }, function (err, result) {
        if (err) throw err;
        console.log("修改成功")
        res.redirect('/admin/posts');
      });
      db.close();
    });
  });
});

module.exports = router;