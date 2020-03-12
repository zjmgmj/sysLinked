(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    $('body').on('tap', '#back', function () {
      back()
    })
    mui('body').on('tap', '#startCreating', function () {
      // alert('---------------create')
      // save(localStorage.getItem('userId'))
      // save(91)
      window.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler('getUserId', '', (result) => {
          const resData = JSON.parse(result)
          const userId = resData.userId
          save(userId)
        })
      })
    })
    function save (userId) {
      const params = {
        orgName: $('#createEnterprise').val(),
        userid: Number(userId)
      }
      $ajax('/org/save', 'post', params, function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          window.setupWebViewJavascriptBridge(bridge => {
            bridge.callHandler('setOrgId', JSON.stringify({
              defaultOrgId: res.data.id
            }))
          })
          setTimeout(() => {
            back()
          }, 500)
        }
      })
    }
  });
})(mui, document, jQuery);