$(document).ready(function(){

  $('#delete').click(function(event){
    event.preventDefault();
    swal({
            title: '작품 삭제하기',
            text: "정말 지우시겠습니까?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제하기',
            cancelButtonText: '취소'
        }).then(function () {

          $.ajax({
            url: $('#delete').attr('href'),
            type: 'GET',
            success: function(result){
              //요청 완료시
              location.href = '/mypage';
            },
            error: function(){
              //요청 실패시
              swal('Fail', '작품 삭제를 실패했습니다.', 'error')
            }
          });

        })
  });

});
