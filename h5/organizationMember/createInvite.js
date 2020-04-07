(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    // const orgId = ''
    // const userId = ''
    const orgId = localStorage.getItem('orgDefault')
    const userId = localStorage.getItem('userId')
    $('body').on('tap', '#sendMessage', function () {
      const params = {
        inviterUserId: userId,
        list: $('#email').val().split(','),
        orgId: orgId,
        type: 1
      }
      $ajax('/user/sendorgeamil', 'post', params, function (res) {
        console.log(res)
        if (res.code === 1) {
          mui.toast('success')
          setTimeout(() => {
            window.setupWebViewJavascriptBridge(bridge => {
              bridge.callHandler('pushTosecond', 'no')
              back()
            })
          }, 1000)
        } else {
          mui.toast(res.msg)
        }
      })
    })

    $('body').on('tap', '#back', function () {
      window.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler('pushTosecond', 'no')
        back()
      })
    })
  });
})(mui, document, jQuery);