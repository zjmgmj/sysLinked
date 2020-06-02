(function ($$, doc, $) {
  mui.init()
  mui.ready(function () {
    const pickButtons = ['取消', '确认']
    const dayPicker = new mui.DtPicker({
      buttons: pickButtons,
      type: 'date',
      beginYear: 2014,
      endYear: 2129
    })
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    function loadData () {
      $('#avatar').attr('src', imgPath + userInfo.userPic)
      $('#companyName').val(userInfo.userNickname)
      $('#jobTitle').val(userInfo.position)
      $('#birthdayVal').text(iosDateFormtter(userInfo.birthday))
      $('#contactInfo').val(userInfo.userLogin)
      $('#address').val(userInfo.address)
    }
    loadData()

    mui('body').on('change', '.upload-input', function () {
      // 修改头像
      loadingShow()
      const file = this.files[0]
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData)
    })
    function uploadImg (formData) {
      $upload('/upload/fileuploadaws', 'post', formData, (res) => {
        if (res.code === 1) {
          const params = JSON.parse(localStorage.getItem('userInfo'))
          params.userPic = res.data.url
          $('#avatar').attr('src', imgPath + res.data.url)
          userUpdate(params)
        }
      })
    }

    $('#companyName').on('input', function () { 
      const params = JSON.parse(localStorage.getItem('userInfo'))
      const name = $(this)[0].value
      params.userNickname = name
      userUpdate(params)
    })
    $('#jobTitle').on('input', function () {
      const params = JSON.parse(localStorage.getItem('userInfo'))
      params.position = $(this)[0].value
      userUpdate(params)
    })
    mui('body').on('tap', '#birthday', function () {
      dayPicker.setSelectedValue($('#birthdayVal')[0].innerText)
      dayPicker.show((res) => {
        $('#birthdayVal')[0].innerText = res.text.replace(/-/g, '/')
        const params = JSON.parse(localStorage.getItem('userInfo'))
        params.birthday = new Date(res.text)
        userUpdate(params)
      })
    })
    $('#contactInfo').on('input', function () {
      const params = JSON.parse(localStorage.getItem('userInfo'))
      params.userLogin = $(this)[0].value
      userUpdate(params)
    })
    $('#address').on('input', function () {
      const params = JSON.parse(localStorage.getItem('userInfo'))
      params.address = $(this)[0].value
      userUpdate(params)
    })
    function userUpdate (userInfo) {
      userInfo.type = 0
      $ajax('/user/update', 'post', userInfo, function (res) {
        console.log(res)
        if (res.code === 1) {
          localStorage.setItem('userInfo', JSON.stringify(res.data))
        }
        loadingHide()
      })
    }
    mui('body').on('tap', '#back', function () {
      back()
    })
  })
})(mui, document, jQuery);