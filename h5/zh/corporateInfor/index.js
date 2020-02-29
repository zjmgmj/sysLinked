(function ($$, doc, $) {
  mui.init()
  mui.ready(function () {
    const orgPublicityList = [
      { value: 1, text: 'Public enterprise' },
      { value: 2, text: 'Private enterprise' }
    ]
    loadData()
    function loadData () {
      $ajax('/org/detail?id=' + getUrlParam('id'), 'get', '', function (res) {
        console.log(res)
        const resData = res.data
        if (res.code === 1) {
          localStorage.setItem('orgDetail', JSON.stringify(resData))
          $('#companyName').val(resData.orgName)
          if (resData.orgPic) {
            $('.avatar').attr('src', imgPath + resData.orgPic)
          }
          const orgPublicity = orgPublicityList.find((item) => {
            return item.value === resData.orgPublicity
          })
          if (orgPublicity) {
            $('#opennessVal').text(orgPublicity.text)
            $('#opennessVal').attr('data-val', orgPublicity.value)
          }
        }
      })
    }

    mui('body').on('tap', '#back', function () {
      mui.back()
    })

    const pickButtons = ['cancel', 'sure']
    const corporatePicker = new mui.PopPicker({
      buttons: pickButtons
    });
    // orgPublicity 1 公有企业 2私有企业

    corporatePicker.setData(orgPublicityList)
    mui('body').on('tap', '#corporateOpenness', function () {
      // const me = this
      console.log('corporateOpenness')
      corporatePicker.show(function (items) {
        $('#opennessVal').text(items[0].text)
        $('#opennessVal').attr('data-val', items[0].value)
        const params = JSON.parse(localStorage.getItem('orgDetail'))
        params.orgPublicity = items[0].value
        updateOrg(params)
      });
    })


    function updateOrg (params) {
      $ajax('/org/update', 'post', params, function (res) {
        console.log(res)
        if (res.code === 1) {
          localStorage.setItem('orgDetail', JSON.stringify(params))
          loadingHide()
        }
      })
    }

    mui('body').on('change', '#companyName', function () {
      const params = JSON.parse(localStorage.getItem('orgDetail'))
      params.orgName = $(this)[0].value
      updateOrg(params)
    })

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
          const params = JSON.parse(localStorage.getItem('orgDetail'))
          params.orgPic = res.data.url
          $('.avatar').attr('src', imgPath + res.data.url)
          updateOrg(params)
        }
      })
    }
    mui('body').on('tap', '#back', function () {
      mui.back()
    })
  })
})(mui, document, jQuery);