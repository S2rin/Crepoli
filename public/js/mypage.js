$(document).ready(function(){

  $('#mygallery').click(function(event){
    event.preventDefault();
    $('#mygallery h3').removeClass();
    $('#mymarket h3').removeClass();
    $('#mymarket h3').addClass("text-menu");
    $('#mygallery h3').addClass("text-menu active");
    $.ajax({
      url: $(this).attr('href'),
      type: 'GET',
      success: function(result){
        //요청 완료시
        // alert(result[0].nickname);
        var str_html = '';
        for(var i = 0; i<result.length; i++){
          str_html += '<figure><a href=\"/mypage/pieces/' + result[i].piece_code + '\">';
          str_html += '<img src=\"/upload/' + result[i].piece_image + '\"></a>';
          str_html += '<figcaption><p class=\"img-title\">' + result[i].piece_name + '</p>';
          str_html += '<p class=\"img-desc\">' + result[i].nickname + '</p></figcatipn></figure>';
        }

        $('#columns').html();
        $('#columns').html(str_html);
      },
      error: function(){
        //요청 실패시
        swal('Fail', '갤러리 정보 조회에 실패했습니다.', 'error')
      }
    });
  });

  $('#mymarket').click(function(event){
    event.preventDefault();
    $('#mygallery h3').removeClass();
    $('#mymarket h3').removeClass();
    $('#mygallery h3').addClass("text-menu");
    $('#mymarket h3').addClass("text-menu active");

    $.ajax({
      url: $(this).attr('href'),
      type: 'GET',
      success: function(result){
        //요청 완료시
        // alert(result[0].nickname);
        var str_html = '';
        for(var i = 0; i<result.length; i++){
          str_html += '<figure><a href=\"/mypage/goods/' + result[i].goods_code + '\">';
          str_html += '<img src=\"/upload/' + result[i].goods_image + '\"></a>';
          str_html += '<figcaption><p class=\"img-title\">' + result[i].goods_name + '</p>';
          str_html += '<p class=\"img-desc\">' + result[i].goods_cost + ' ￦' + '</p></figcatipn></figure>';
        }

        $('#columns').html();
        $('#columns').html(str_html);
      },
      error: function(){
        //요청 실패시
        swal('Fail', '마켓 정보 조회에 실패했습니다.', 'error')
      }
    });

  });

});
