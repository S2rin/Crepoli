$(document).ready(function() {

  $('#logout').click(function(event){
    event.preventDefault();
    swal({
            title: '로그아웃',
            text: "로그아웃 하시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '로그아웃하기',
            cancelButtonText: '취소'
        }).then(function () {

          $.ajax({
            url: $('#logout').attr('href'),
            type: 'GET',
            success: function(result){
              //요청 완료시
              location.href = '/';
            },
            error: function(){
              //요청 실패시
              swal('Fail', '로그아웃에 실패했습니다.', 'error')
            }
          });

        })
  });

  $('#my_purchase').click(function(event){
    event.preventDefault();
    $('#my_purchase h3').removeClass();
    $('#mymarket h3').removeClass();
    $('#mymarket h3').addClass("text-menu");
    $('#my_purchase h3').addClass("text-menu active");

    $.ajax({
      url: $(this).attr('href'),
      type : 'GET',
      success : function(result){
        var str_html = '';
        str_html += '<thead><tr><th>구매 신청일</th>' + '<th>구매 내역</th><th>구매 취소</th>' + '</tr></thead>';
        str_html += '<tbody>';
        for(var i=0; i<result.length; i++){
          str_html += '<tr>';
          str_html += '<td>' + result[i].buy_date +'</td>';
          str_html += '<td>' + result[i].goods_name + '</td>';
          str_html += '<td><a href=\"/setting/cancel/market/' + result[i].goods_code + '\">취소</a></td>';
          str_html += '</tr>';
        }

        $('#tables').html();
        $('#tables').html(str_html);
      },
      error: function(){
        //요청 실패시
        swal('Fail', '구매 내역 조회에 실패했습니다.', 'error')
      }
    });
  });

  $('#my_match').click(function(event){
    event.preventDefault();
    $('#my_purchase h3').removeClass();
    $('#mymarket h3').removeClass();
    $('#my_purchase h3').addClass("text-menu");
    $('#my_match h3').addClass("text-menu active");

    $.ajax({
      url: $(this).attr('href'),
      type : 'GET',
      success : function(result){
        var str_html = '';
        str_html += '<thead><tr><th>신청일</th>' + '<th>내역</th><th>취소</th>' + '</tr></thead>';
        str_html += '<tbody>';
        for(var i=0; i<result.length; i++){
          str_html += '<tr>';
          str_html += '<td>' + result[i].match_date +'</td>';
          str_html += '<td>' + result[i].collabo_name + '</td>';
          str_html += '<td><a href=\"/setting/cancel/collabo/' + result[i].collabo_code + '\">취소</a></td>';
          str_html += '</tr>';
        }

        $('#tables').html();
        $('#tables').html(str_html);
      },
      error: function(){
        //요청 실패시
        swal('Fail', '콜라보신청 내역 조회에 실패했습니다.', 'error')
      }
    });
  });

});
