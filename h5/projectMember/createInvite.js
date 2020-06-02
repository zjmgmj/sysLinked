(function ($$, doc, $) {
  mui.init();
  mui.ready(function () { 
    const pid = getUrlParam('pid')
    $('body').on('tap', '#sendMessage', function () {
      console.log($('#email').val().split(','))
      const emailList = $('#email').val().split(',')
      // const emailReg = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/
      const isEmail = emailList.find((item) => {
        return !emailReg.test(item)
      })
      if (isEmail) {
        mui.toast('Email is malformed')
        return false
      }
      const params = {
        inviterUserId: Number(localStorage.getItem('userId')),
        list: emailList,
        orgId: Number(localStorage.getItem('orgDefault')),
        type: 1
      }
      $ajax('/user/sendorgeamil', 'post', params, function (res) {
        console.log(res)
        if (res.code === 1) {
          mui.toast('success')
          setTimeout(() => {
            // back()
            mui.back()
          }, 1000)
        } else {
          mui.toast(res.msg)
        }
      })
    })

    // mui('body').on('input', '#email', function (res) {
    //   console.log('---------6', res.target.value)
    // })

    $('body').on('tap', '#back', function () {
      // back()
      mui.back()
    })
  });
})(mui, document, jQuery);