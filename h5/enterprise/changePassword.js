(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    mui('body').on('tap', '#back,.cancel', function () {
      mui.back()
    })

    mui('body').on('tap', '.submit', function () {
      const oldPassword = $('#oldPassword').val()
      if (!oldPassword) { 
        // mui.toast('请输入旧密码')
        mui.toast('Please enter the old password')
        return false
      }
      const newPassword = $('#newPassword').val()
      const repeatNewPassword = $('#repeatNewPassword').val()
      if (newPassword.length < 7) { 
        // mui.toast('请输入六位数以上密码')
        mui.toast('Please enter a password with more than six digits')
        return false
      }
      if (newPassword !== repeatNewPassword) {
        // mui.toast('二次密码输入不一致')
        mui.toast('Inconsistent secondary password entry')
        return false
      }
      const userId = getUrlParam('userId')
      const params = {
        type: 3,
        userId: Number(userId),
        userNewPassword: newPassword,
        userPassword: oldPassword,
      }
      save(params)
    })

    function save(params) {
      $ajax('/user/update', 'post', params, function (res) {
        mui.toast(res.msg == '原始密码错误' ? 'The original password is wrong' : res.msg)
        if (res.code === 1) {
          setTimeout(() => {
            back()
          }, 500)
        }
      })
    }

  });
})(mui, document, jQuery);