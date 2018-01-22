$(document).ready(function(){

  $('#buyGoods').click(function(event){
    event.preventDefault();
    swal({
            title: '신청하기',
            text: "상품을 신청하시겠습니까?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '신청하기',
            cancelButtonText: '취소'
        }).then(function () {
          var _order = $('#goods_order').text();

          $.ajax({
            url: $('#buyGoods').attr('href'),
            type: 'POST',
            data: {order: _order},
            datatype: 'text',
            timeout: 10000,
            success: function(result){
              //요청 완료시
              location.href = '/market';
            },
            error: function(){
              //요청 실패시
              swal('Fail', '상품 신청에 실패했습니다.', 'error')
            }
          });

        })
  });

});
