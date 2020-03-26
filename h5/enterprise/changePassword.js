(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    mui('body').on('tap', '#back,.cancel', function () {
      mui.back()
    })

    mui('body').on('tap', '.submit', function () {
      const oldPassword = $('#oldPassword').val()
      if (!oldPassword) { 
        mui.toast('请输入旧密码')
        return false
      }
      const newPassword = $('#newPassword').val()
      const repeatNewPassword = $('#repeatNewPassword').val()
      if (newPassword.length < 7) { 
        mui.toast('请输入六位数以上密码')
        return false
      }
      if (newPassword !== repeatNewPassword) {
        mui.toast('二次密码输入不一致')
        return false
      }
      // const userId = getUrlParam('userId')
      // const params = {
      //   type: 3,
      //   userId: Number(userId),
      //   userNewPassword: newPassword,
      //   userPassword: oldPassword,
      // }
      const params = JSON.parse(localStorage.getItem('userInfo'))
      params.userNewPassword = newPassword
      params.userPassword = oldPassword
      params.type = 3
      save(params)
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