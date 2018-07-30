var express = require('express');
var router = express.Router();
// 验证码
var svgCaptcha = require('svg-captcha');

var mongoClient = require("mongodb").MongoClient;
var db_url = "mongodb://127.0.0.1:27017/myblog";

/* GET users listing. */
// 登录页面
router.get('/', function (req, res, next) {
  // console.log("hi");
  res.render("admin/login")
});

// 验证码
router.get('/code', function (req, res, next) {
  var captcha = svgCaptcha.create({
    size: 4,
    fontSize: 50,
    width: 80,
    height: 38,
    background: "#FDF6E3"
  });
  // .toLowerCase()
  req.session.code = captcha.text.toLowerCase();
  res.type('svg');
  res.status(200).send(captcha.data);
})

// 注销页面
router.get('/logout', function (req, res, next) {
  req.session.isLogin = null;
  res.redirect('/admin/users');
});

router.post('/login', function (req, res, next) {
  var name = req.body.username;
  var pwd = req.body.pwd;
  //获取验证码
  var code = req.body.mycode;
  // console.log(code);
  // console.log(req.session.code);
  // 记住密码选项
  var remember = req.body.remember;
  //console.log(remember);

  if(code == req.session.code){
    mongoClient.connect(db_url, function (err, db) {
      if (err) throw err;
      var users = db.collection("users");
      users.find({ name: name, pwd: pwd }).toArray(function (err, result) {
        if (err) throw err;
        if (result.length) {
          req.session.isLogin = true;
          // 判断是否选中记住密码 
          if(remember != null){
            req.session.cookie.maxAge = 1000 * 3600 * 24 *7;
          }else{
            req.session.cookie.maxAge = null
          }
          res.redirect('/admin/index');
        } else {
          res.redirect('/admin/users');
        }
      });
      db.close();
    });
  }else {
    res.redirect('/admin/users');
  }
});

module.exports = router;
