(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const email = getUrlParam('email')
    const userId = getUrlParam('userId')
    if (!email) {
      $('#mailboxTitle').text('邮箱')
      $('#mailbox').attr('readonly', false)
      $('#oldMail').hide()
    } else {
      $('#mailboxTitle').text('更换邮箱')
      $('#mailbox').attr('readonly', true)
      $('#mailbox').val(email)
    }
    mui('body').on('tap', '#back,.cancel', function () {
      mui.back()
    })

    mui('body').on('tap', '.code-button', function () {
      sendCode()
    })

    function sendCode() {
      const toeamil = $('#alternateMailbox').val()
      if (!emailReg.test(toeamil)) {
        mui.toast('邮箱格式错误')
        return false
      }
      $ajax('/user/sendeamil?type=1&toeamil=' + toeamil, 'get', '', function (res) {
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
      const toeamil = $('#alternateMailbox').val()
      if (!emailReg.test(toeamil)) {
        mui.toast('请输入正确的邮箱格式')
        return false
      }
      const verifCode = $('#VerifCode').val()
      const resCode = $('.code-button').attr('data-code')
      if (verifCode !== resCode) {
        mui.toast('请输入正确验证码')
        return false
      }
      const params = JSON.parse(localStorage.getItem('userInfo'))
      params.userEamil = toeamil
      if (!email) {
        params.type = 1
      }
      save(params)
      console.log(this)
    })

    function save(params) {
      $ajax('/user/update', 'post', params, function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          localStorage.setItem('userInfo', JSON.stringify(res.data))
          setTimeout(() => {
            back()
          }, 500)
        }
      })
    }

  });
})(mui, document, jQuery);