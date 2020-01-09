(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    $('body').on('tap', '#sendMessage', function () {
      const params = {
        inviterUserId: Number(localStorage.getItem('userId')),
        list: $('#email').val().split(','),
        orgId: Number(localStorage.getItem('orgDefault')),
        type: 1
      }
      $ajax('/user/sendorgeamil', 'post', params, function (res) {
        console.log(res)
        if (res.code === 1) {
          mui.toast('发送成功')
          setTimeout(() => {
            back()
          }, 1000)
        } else {
          mui.toast(res.msg)
        }
      })
    })

    $('body').on('tap', '#back', function () {
      back()
    })
  });
})(mui, document, jQuery);