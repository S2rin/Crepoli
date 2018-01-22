var express = require('express');
var router = express.Router();
var fs = require('fs');

/* dateTime*/
var dateutils = require('date-utils');
var dt = new Date();
var d = dt.toFormat('YYYY-MM-DD');

/* 파일 업로드를 위한 multer 설정*/
var multer = require('multer');
var storage = multer.diskStorage({
  //저장할 폴더
  destination : './public/upload/',
  //저장할 파일명
  filename: function (req, file, cb){
    cb(null, file.originalname);
  }
});

//multer 설정
var upload = multer({storage: storage});

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

//[GET] mypage_home
router.get('/', isAuthenticated,function(req, res) {
  var userid = req.session.passport.user.user_id;
  var nickname = req.session.passport.user.nickname;

  var all_piece = 'SELECT * FROM piece where member_id = ? order by piece_code desc';
  connection.query(all_piece,[userid],function(err,result){
    if(err){
      console.error(err);
    }else{
      for(var i = 0; i<result.length;i++){
        result[i].nickname = nickname;
      }
      res.render('mypage', { title: 'CrePoli - Mypage', nickname : nickname, rows:result});
    }
  });

});

//[GET] gallery
router.get('/gallery', isAuthenticated, function(req, res){

  var userid = req.session.passport.user.user_id;
  var nickname = req.session.passport.user.nickname;

  var all_piece = 'SELECT * FROM piece where member_id = ? order by piece_code desc';
  connection.query(all_piece,[userid],function(err,result){
    if(err){
      console.error(err);
    }else{
      for(var i = 0; i<result.length;i++){
        result[i].nickname = nickname;
      }
      res.writeHeader(200, {"Content-Type": "text/json;charset = utf-8", });
      res.end(JSON.stringify(result));
    }
  });
});

// [GET] gallery_detail
router.get('/pieces/:piece_code',isAuthenticated,function(req, res){
  var piece_code = req.params.piece_code;

  var detail_query = 'SELECT * FROM piece join member ON piece.member_id = member.member_id WHERE piece_code=?';
  connection.query(detail_query,[piece_code],function(err,result){
    res.render('mygallery_detail',{rows:result});
  });
});

// [GET] Update piece page
router.get('/pieces/update/:piece_code', isAuthenticated, function(req, res){
  var piece_code = req.params.piece_code;

  var piece_query = 'SELECT * FROM piece WHERE piece_code = ?';
  connection.query(piece_query,[piece_code],function(err, result){
    if(err){
      console.error(err);
    }else{
      res.render('gallery_update',{rows:result});
    }
  });
});

// [POST] Update piece
router.post('/pieces/update/:piece_code', upload.single('uploadFile'), isAuthenticated, function(req, res){
  var piece_code = req.params.piece_code;
  var pieceName = req.body.pieceName;
  var pieceContent = req.body.pieceContent;
  var pieceImage = req.file.originalname;

  console.log(pieceName +", "+ pieceContent +", "+ pieceImage);
  var datas = [pieceName, pieceContent, d, pieceImage, piece_code];
  var update_piece = 'UPDATE piece SET piece_name=?, piece_content=?,piece_date=?,piece_image=? where piece_code=?';

  connection.query(update_piece, datas, function(err,result){
    if(err){
      throw err;
    }else{
      res.redirect('/mypage/pieces/'+piece_code);
    }
  });
});

// [GET] Delete piece
router.get('/pieces/delete/:piece_code',isAuthenticated, function(req, res){
  var piece_code = req.params.piece_code;

  var delete_query = 'DELETE FROM piece WHERE piece_code = ?';
  connection.query(delete_query,[piece_code],function(err, result){
    if(err){
      console.error(err);
    }else{
      //파일 삭제
      res.send();
    }
  });
});

//[GET] market
router.get('/market', isAuthenticated, function(req, res){

  var userid = req.session.passport.user.user_id;
  var nickname = req.session.passport.user.nickname;

  var all_goods = 'SELECT * FROM goods where member_id = ? order by goods_code desc';
  connection.query(all_goods,[userid],function(err,result){
    if(err){
      console.error(err);
    }else{
      for(var i = 0; i<result.length;i++){
        result[i].nickname = nickname;
      }
      res.writeHeader(200, {"Content-Type": "text/json;charset = utf-8", });
      res.end(JSON.stringify(result));
    }
  });
});

// [GET] market_detail
router.get('/goods/:goods_code',isAuthenticated,function(req, res){
  var goods_code = req.params.goods_code;

  var detail_query = 'SELECT * FROM goods join member ON goods.member_id = goods.member_id WHERE goods_code=?';
  connection.query(detail_query,[goods_code],function(err,result){
    res.render('mymarket_detail',{rows:result});
  });
});

// [GET] Update goods page
router.get('/goods/update/:goods_code', isAuthenticated, function(req, res){
  var goods_code = req.params.goods_code;

  var goods_query = 'SELECT * FROM goods WHERE goods_code = ?';
  connection.query(goods_query,[goods_code],function(err, result){
    if(err){
      console.error(err);
    }else{
      res.render('market_update',{rows:result});
    }
  });
});

//[POST] goods update
router.post('/goods/update/:goods_code',upload.single('uploadFile'),isAuthenticated,function(req,res){
  var goods_code = req.params.goods_code;
  var goodsName = req.body.goodsName;
  var goodsPrice = req.body.goodsPrice;
  var goodsMinorder = req.body.goodsMinorder;
  var goodsContent = req.body.goodsContent;
  var goodsImage = req.file.originalname;

  console.log(goods_code + ", "+goodsName + ", " + goodsPrice + ", " + goodsMinorder + ", " + goodsContent + ", " + goodsImage);
  var datas = [goodsName, goodsPrice, goodsContent, d, goodsMinorder, goodsImage, goods_code];
  var update_goods = 'UPDATE goods SET goods_name=?, goods_cost=?, goods_content=?, goods_date=?, goods_minorder=?, goods_image=?'
    + 'WHERE goods_code=?';

  connection.query(update_goods, datas, function(err,result){
    if(err){
      console.error(err);
    }else{
      res.redirect('/mypage/goods/'+ goods_code);
    }
  });
});

//[GET] goods delete
router.get('/goods/delete/:goods_code', isAuthenticated, function(req, res){
  var goods_code = req.params.goods_code;

  var delete_query = 'DELETE FROM goods WHERE goods_code = ?';
  connection.query(delete_query,[goods_code],function(err, result){
    if(err){
      console.error(err);
    }else{
      //파일 삭제
      res.send();
    }
  });
});

module.exports = router;
