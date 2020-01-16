(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const phoneNumber = getUrlParam('phone')
    const userId = getUrlParam('userId')
    $('#phoneNumber').val(phoneNumber)
    mui('body').on('tap', '#back,.cancel', function () {
      mui.back()
    })

    mui('body').on('tap', '.code-button', function () {
      sendCode()
    })

    function sendCode() {
      const newPhoneNum = $('#newPhoneNum').val()
      if (!newPhoneNum) {
        mui.toast('手机号码不能为空')
        return false
      }
      $ajax('/user/sendcodes?type=3&phone=' + newPhoneNum, 'get', '', function (res) {
        if (res.code === 1) {
          mui.toast('发送成功')
          $('.code-button').attr('data-code', res.data)
          let time = 60
          const timeInter = setInterval(() => {
            time--
            if (time === 0) {
              clearInterval(timeInter)
              $('.code-button').text('Verification Code')
              return false
            }
            $('.code-button').text(time)
          }, 1000)
        } else {
          mui.toast('发送失败')
        }
        console.log(this)
      })
    }

    mui('body').on('tap', '.submit', function () {
      const newPhoneNum = $('#newPhoneNum').val()
      if (!newPhoneNum) {
        mui.toast('手机号码不能为空')
        return false
      }
      const verifCode = $('#verifCode').val()
      const resCode = $('.code-button').attr('data-code')
      if (verifCode !== resCode) {
        mui.toast('请输入正确验证码')
        return false
      }
      const params = {
        type: 2,
        userId: userId,
        userLogin: newPhoneNum
      }
      save(params)
      console.log(this)
    })

    function save(params) {
      $ajax('/user/update', 'post', params, function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          setTimeout(() => {
            back()
          }, 500)
        }
      })
    }

  });
})(mui, document, jQuery);