$(document).ready(function(){

  $('#regist_btn').click(function(event){
    event.preventDefault();
    swal({
            title: '신청하기',
            text: "콜라보를 신청하시겠습니까?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '신청하기',
            cancelButtonText: '취소'
        }).then(function () {
          $.ajax({
            url: $('#regist_btn').attr('href'),
            type: 'GET',
            success: function(result){
              //요청 완료시
              swal('Success', '콜라보 신청 성공!', 'info')
            },
            error: function(){
              //요청 실패시
              swal('Fail', '콜라보 신청이 실패했습니다.', 'error')
            }
          });

        })
  });

});
