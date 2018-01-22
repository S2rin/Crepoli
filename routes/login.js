/* Express*/
var express = require('express');
var router = express.Router();

/* 쿠키 세션*/
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

/* Passport*/
var passport = require('passport');
var NaverStrategy = require('passport-naver').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var secret_config = require('../service/secret');

/* Mysql*/
var mysql_dbc = require('../service/dbconnect')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

/* 로그인 성공시 사용자 정보를 Session에 저장 */
passport.serializeUser(function (user, done) {
  done(null, user)
});

/* 인증 후, 페이지 접근시 사용자 정보를 Session에서 읽어옴*/
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/*로그인 판단 */
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();

    var link ="<link rel=\'stylesheet\' href=\'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css\' />";
    var script = "<script src=\'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js\'></script>"+
    "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js\"></script>";
    var alert = "swal({ title:\"Login\", text: \"로그인을 먼저 해주세요!\"}, function(){location.href='/'})";

    res.writeHeader(200, {"Content-Type": "text/html;charset = utf-8", });
    res.write("<html><head>"+link+script+"</head><body></body><script>"+alert+"</script></html>");
    res.end();
};

//Kakao passport setting
passport.use(new KakaoStrategy({
  clientID: secret_config.federation.kakao.client_id,
  callbackURL: secret_config.federation.kakao.callback_url
  },
  function(accessToken, refreshToken, profile, done){
    var _profile = profile._json;

    loginByThirdparty({
      'auth_type': 'kakao',
      'auth_id': _profile.id,
      'auth_name': _profile.properties.nickname,
      'auth_email':_profile.kaccount_email}, done);
    }
));

//Naver passport setting
passport.use(new NaverStrategy({
  clientID: secret_config.federation.naver.client_id,
  clientSecret: secret_config.federation.naver.secret_id,
  callbackURL: secret_config.federation.naver.callback_url},
  function(accessToken, refreshToken, profile, done){
    var _profile = profile._json;

    loginByThirdparty({
      'auth_type': 'naver',
      'auth_id': _profile.id,
      'auth_name':_profile.nickname,
      'auth_email': _profile.email
    }, done);
  }
));

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'CrePoli - Login' });
});

//kakao 로그인
router.get('/oauth/kakao',passport.authenticate('kakao'));
// kakao 로그인 연동 콜백
router.get('/oauth/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/main',
    failureRedirect: '/'
  })
);

// naver 로그인
router.get('/oauth/naver', passport.authenticate('naver'));
// naver 로그인 연동 콜백
router.get('/oauth/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/main',
    failureRedirect: '/'
  })
);


// logout
router.get('/logout',function(req,res){
  console.info('logout!');
  req.logout();
  req.session = null;
  res.redirect('/');
});

/* 로그인 처리 */
function loginByThirdparty(info, done){
  console.log('process : ' + info.auth_type);

  var search_user = 'SELECT * FROM member WHERE member_id = ?'
  connection.query(search_user, [info.auth_id], function(err,result){
    if(err){
      return done(err);
    }else{
      if(result.length == 0){
        //TODO : 신규 유저 가입
        var insert_user = 'INSERT INTO member (member_id, member_nick, member_email) VALUES (?,?,?)'
        connection.query(insert_user,[info.auth_id, info.auth_name, info.auth_email], function(err){
          if(err){
            return done(err);
          }else{
            done(null,{
              'user_id': info.auth_id,
              'nickname': info.auth_name
            });
          }
        });
      }else{
        //TODO : 기존 유저 로그인 처리
        console.log('old User');
        done(null,{
          'user_id': result[0].member_id,
          'nickname': result[0].member_nick
        });
      }
    }
  });
}

module.exports = router;
