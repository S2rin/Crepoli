$(document).ready(function() {

  $('#search_market').click(function(event){
    event.preventDefault();

    var _search = $("input[name='searchData']").val();

    $.ajax({
      url: $(this).attr('href'),
      type : 'POST',
      data : {search : _search},
      datatype : 'text',
      timeout : 10000,
      success : function(result){
        //요청 완료시
        if(result.length < 0){
          swal('Fail', '검색 결과가 없습니다.', 'error')
        }else{
          var str_html = '';
          for(var i = 0; i<result.length; i++){
            str_html += '<figure><a href=\"/mypage/goods/' + result[i].goods_code + '\">';
            str_html += '<img src=\"/upload/' + result[i].goods_image + '\"></a>';
            str_html += '<figcaption><p class=\"img-title\">' + result[i].goods_name + '</p>';
            str_html += '<p class=\"img-desc\">' + result[i].goods_cost + ' ￦' + '</p></figcatipn></figure>';
          }

          $('#columns').html();
          $('#columns').html(str_html);
        }
      },
      error: function(){
        //요청 실패시
        swal('Fail', '마켓 검색에 실패했습니다.', 'error')
      }
    });
  });

});
