var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

// 首页二级路由
var indexRouter = require('./routes/home/index');
// 文章列表
// var articleRouter = require('./routes/home/articleList');
// 详情二级路由
var articleRouter = require('./routes/home/article');
// 留言板
var messRouter =  require('./routes/home/mess');

// 后台首页
var adminRouter = require('./routes/admin/admin');
// 后台分类管理
var cartsRouter = require('./routes/admin/carts');
// 后台文章管理
var postsRouter = require('./routes/admin/posts');
//登录用户
var usersRouter = require('./routes/admin/users');

var app = express();

app.use(session({
  secret: 'blog',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html',require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 在创建一个静态资源库，访问静态资源文件时，express.static 中间件会根据目录添加的顺序查找所需的文件。
app.use(express.static(path.join(__dirname, 'views/admin')));

//首页一级路由
app.use('/', indexRouter);
// 文章一级路由
app.use('/article',articleRouter);
// 留言板
app.use('/mess',messRouter);

// 错误原因： /admin  
//要使用checkLogin来判断是否登录
app.use('/admin/index', checkLogin);
// 后台首页
app.use('/admin/index',adminRouter);
// 后台分类管理
app.use('/admin/carts',checkLogin);
app.use('/admin/carts',cartsRouter);
//后台文章管理
app.use('/admin/posts',checkLogin);
app.use('/admin/posts',postsRouter);


//登录页面
app.use('/admin/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//  检查是否登录
function checkLogin(req, res, next){
  if(!req.session.isLogin){
    res.redirect('/admin/users');
  }
 next();
}

module.exports = app;
