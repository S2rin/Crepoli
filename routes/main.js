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
router.get('/', isAuthenticated, function(req, res, next) {

  var galley_query = 'SELECT * FROM piece join member ON piece.member_id = member.member_id ORDER BY piece.piece_code desc LIMIT 4';
  var market_query = 'SELECT * FROM goods ORDER BY goods_code desc LIMIT 4';
  var collabo_query = 'SELECT * FROM collabo ORDER BY collabo_code desc LIMIT 4';
  connection.query(galley_query,function(err,result1){
    if(err){
      console.error(err);
    }else{
      connection.query(market_query, function(err,result2){
        if(err){
          console.error(err);
        }else{
          connection.query(collabo_query, function(err, result3){
            if(err){
              console.error(err);
            }else{
              res.render('main', { title: 'CrePoli - MAIN', row1:result1, row2:result2, row3:result3 });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
