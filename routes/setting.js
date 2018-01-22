var express = require('express');
var router = express.Router();

/* mysql */
var mysql_dbc = require('../service/dbconnect')();
var connection = mysql_dbc.init();

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

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
  var userid = req.session.passport.user.user_id;
  var buy_user = 'SELECT * FROM market join goods ON market.goods_code = goods.goods_code where market.member_id=?';

  connection.query(buy_user,[userid],function(err,result){
    if(err){
      console.error(err);
    }else{
      res.render('setting',{row:result});
    }
  });
});

//[GET] 구매 내역
router.get('/market', isAuthenticated, function(req, res){
  var userid = req.session.passport.user.user_id;
  var buy_user = 'SELECT * FROM market join goods ON market.goods_code = goods.goods_code where market.member_id=?';

  connection.query(buy_user,[userid],function(err,result){
    if(err){
      console.error(err);
    }else{
      res.writeHeader(200, {"Content-Type": "text/json;charset = utf-8", });
      res.end(JSON.stringify(result));
    }
  });
});

//[GET] 구매 취소 내역
router.get('/cancel/market/:goods_code', isAuthenticated, function(req, res){
  var userid = req.session.passport.user.user_id;
  var goods_code = req.params.goods_code;

  var delete_market = 'DELETE FROM market where member_id = ? AND goods_code = ?';
  connection.query(delete_market,[userid, goods_code], function(err,result){
    if(err){
      console.error(err);
    }else{
      res.redirect('/setting');
    }
  });
});

//[GET] 콜라보 신청 내역
router.get('/collabo', isAuthenticated, function(req, res){
  var userid = req.session.passport.user.user_id;
  var collabo_user = 'SELECT * FROM collabo join matchs ON collabo.collabo_code = matchs.collabo_code where matchs.member_id=?';

  connection.query(collabo_user,[userid],function(err,result){
    if(err){
      console.error(err);
    }else{
      res.writeHeader(200, {"Content-Type": "text/json;charset = utf-8", });
      res.end(JSON.stringify(result));
    }
  });
});

//[GET] 콜라보 신청 취소 내역
router.get('/cancel/collabo/:collabo_code', isAuthenticated, function(req, res){
   var userid = req.session.passport.user.user_id;
   var collabo_code = req.params.collabo_code;

   var delete_collabo = 'DELETE FROM matchs where member_id = ? AND collabo_code = ?';
   connection.query(delete_collabo,[userid, collabo_code], function(err){
     if(err){
       console.error(err);
     }else{
       res.redirect('/setting');
     }
   });
});

module.exports = router;
