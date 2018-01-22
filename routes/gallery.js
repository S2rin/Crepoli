/* Express & other npm...*/
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

// [GET]gallery_home
router.get('/', isAuthenticated, function(req, res) {

  var all_piece = 'Select m.member_nick, p.piece_code, p.piece_name, p.piece_image from member m, piece p where m.member_id = p.member_id order by p.piece_code desc;';

  connection.query(all_piece, function(err, result){
    if(err){
      console.error(err);
    }else{
      res.render('gallery', { title: 'CrePoli - Gallery',rows:result });
    }
  });
});

// [POST] search
router.post('/search', isAuthenticated, function(req, res){
  var search = req.body.search;
  console.log('검색어 : ' + search);

  var search_query = 'select * from piece join member where piece.member_id = member.member_id AND piece_name LIKE \"%'+ search +'%\" OR piece_content LIKE \"%'+ search +'%\"';

  connection.query(search_query,function(err,result){
    if(err){
      console.error(err);
    }else{
      res.writeHeader(200, {"Content-Type": "text/json;charset = utf-8", });
      res.end(JSON.stringify(result));
    }
  });

});

// [GET]gallery_detail
router.get('/pieces/:piece_code', function(req,res){
  var piece_code = req.params.piece_code;

  var detail_query = 'SELECT * FROM piece join member ON piece.member_id = member.member_id WHERE piece_code=?';
  connection.query(detail_query,[piece_code],function(err,result){
    res.render('gallery_detail',{rows:result});
  });
});

// [GET]upload_page
router.get('/upload',isAuthenticated, function(req,res){
  res.render('gallery_upload');
});

// [POST]upload the file
router.post('/upload',upload.single('uploadFile'),isAuthenticated,function(req,res){
  var userid = req.session.passport.user.user_id;
  var pieceName = req.body.pieceName;
  var pieceContent = req.body.pieceContent;
  var pieceImage = req.file.originalname;
  console.log(pieceName +", "+ pieceContent +", "+ pieceImage);

  var datas = [userid, pieceName, pieceContent, d, pieceImage, '../public/upload/'];
  var insert_piece = 'INSERT INTO piece(member_id, piece_name, piece_content, piece_date, piece_image, piece_image_path) VALUES(?,?,?,?,?,?)';

  connection.query(insert_piece,datas,function(err,result){
    if(err){
      console.error(err);
    }else{
      res.redirect('/gallery');
    }
  });

  console.info(req.file);
});

module.exports = router;
