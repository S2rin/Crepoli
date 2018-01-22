var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

/* mysql */
var mysql_dbc = require('../service/dbconnect')();
var connection = mysql_dbc.init();

/* dateTime*/
var dateutils = require('date-utils');
var dt = new Date();
var d = dt.toFormat('YYYY-MM-DD');

/* 파일 업로드를 위한 multer 설정*/
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

/* [GET] home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  var all_goods = 'SELECT * FROM goods order by goods_code desc';

  connection.query(all_goods, function(err,result){
    if(err){
      throw err;
    }else{
      res.render('market', { title: 'CrePoli - Market', rows:result });
    }
  });
});

// [POST] search
router.post('/search', isAuthenticated, function(req, res){
  var search = req.body.search;
  console.log('검색어 : ' + search);

  var search_query = 'select * from goods where goods_name LIKE \"%'+ search +'%\" OR goods_content LIKE \"%'+ search +'%\"';

  connection.query(search_query,function(err,result){
    if(err){
      console.error(err);
    }else{
      console.log(result);
      res.writeHeader(200, {"Content-Type": "text/json;charset = utf-8", });
      res.end(JSON.stringify(result));
    }
  });

});

router.get('/goods/:goods_code', isAuthenticated, function(req, res){
  var piece_code = req.params.goods_code;

  var detail_query = 'SELECT * FROM goods join member ON goods.member_id = member.member_id WHERE goods_code=?';
  connection.query(detail_query, [piece_code], function(err, result){
    res.render('market_detail', {rows:result});
  });

});

/* [GET] Market_upload page.*/
router.get('/upload', isAuthenticated,function(req,res){
  res.render('market_upload');
});

//[POST] market upload
router.post('/upload',upload.single('uploadFile'),isAuthenticated,function(req,res){
  var userid = req.session.passport.user.user_id;
  var goodsName = req.body.goodsName;
  var goodsPrice = req.body.goodsPrice;
  var goodsMinorder = req.body.goodsMinorder;
  var goodsContent = req.body.goodsContent;
  var goodsImage = req.file.originalname;

  console.log(goodsName + ", " + goodsPrice + ", " + goodsMinorder + ", " + goodsContent + ", " + goodsImage);
  var datas = [userid, goodsName, goodsPrice, goodsContent, d, goodsMinorder, goodsImage, '../public/upload/'];
  var insert_query = 'INSERT INTO goods(member_id, goods_name, goods_cost, goods_content, goods_date, goods_minorder, goods_image, goods_image_path) VALUES(?,?,?,?,?,?,?,?)';

  connection.query(insert_query, datas, function(err,result){
    if(err){
      throw err;
    }else{
      res.redirect('/market');
    }
  });
});

// [POST] buy the goods
router.post('/goods/purchase/:goods_code', isAuthenticated, function(req, res){
  var userid = req.session.passport.user.user_id;
  var goods_order = req.body.order;
  goods_order = parseInt(goods_order);
  goods_order += 1;
  var goods_code = req.params.goods_code;

  var update_query = 'UPDATE goods SET goods_order = ? WHERE goods_code = ?';
  connection.query(update_query, [goods_order, goods_code], function(err){
    if(err){
      console.error(err);
    }else{
      var insert_market = 'INSERT INTO market (member_id, goods_code, buy_date)VALUES(?,?,?)';
      connection.query(insert_market, [userid, goods_code, d], function(err){
        if(err){
          console.error(err);
        }else{
          console.log('성공!');
          res.send();
        }
      });
    }
  });

  res.send();
});

module.exports = router;
