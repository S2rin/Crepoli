var express = require('express');
var router = express.Router();

/* mysql */
var mysql_dbc = require('../service/dbconnect')();
var connection = mysql_dbc.init();

/* dateTime*/
var dateutils = require('date-utils');
var dt = new Date();
var d = dt.toFormat('YYYY-MM-DD');

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

/* GET Collabo page. */
router.get('/', isAuthenticated, function(req, res) {
  connection.query('SELECT * FROM collabo', function(err, result){
    if(err){
      console.error(err);
    }else{
      res.render('collabo', { title: 'CrePoli - Collabo', rows:result });
    }
  });
});

/* GET Collabo_detail page. */
router.get('/detail/:collabo_code', isAuthenticated, function(req,res){
  var collabo_code = req.params.collabo_code;
  connection.query('SELECT * FROM collabo WHERE collabo_code = ?', [collabo_code], function(err, result){
    if(err){
      console.error(err);
    }else{
      res.render('collabo_detail',{rows:result});
    }
  });
});

// [GET] Regist Collabo
router.get('/regist/:collabo_code', isAuthenticated, function(req, res){
  var collabo_code = req.params.collabo_code;
  var userid = req.session.passport.user.user_id;

  var insert_query = 'INSERT INTO matchs (member_id, collabo_code, match_date) VALUES (?,?,?)';
  connection.query(insert_query, [userid, collabo_code, d], function(err){
    if(err){
      console.error(err);
    }else {
      res.end();
    }
  });
});

module.exports = router;
