var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

/* 페이지 라우트*/
var login = require('./routes/login');
var main = require('./routes/main');
var gallery = require('./routes/gallery');
var market = require('./routes/market');
var collabo = require('./routes/collabo');
var mypage = require('./routes/mypage');
var setting = require('./routes/setting');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  keys: ['surin'],
  cookie: {
    maxAge: 100 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', login);
app.use('/main', main);
app.use('/gallery', gallery);
app.use('/market', market);
app.use('/collabo',collabo);
app.use('/mypage', mypage);
app.use('/setting', setting);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
