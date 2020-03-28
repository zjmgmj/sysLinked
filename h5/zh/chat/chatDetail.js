(function ($$, doc, $) {
  mui.init()
  mui.ready(function () {
    // const orgId = 32
    // const userId = 34
    // getuser()
    // function getuser() {
    //   $ajax('/user/getuser?userId=91', 'get', '', function (res) {
    //     // console.log(res)
    //     const resData = res.data
    //     localStorage.setItem('userInfo', JSON.stringify(resData))
    //   })
    // }
    const orgId = localStorage.getItem('orgDefault')
    const userId = localStorage.getItem('userId')
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const userNickname = userInfo.userNickname
    const senderId = Number(getUrlParam('staffId'))
    const authorPic = userInfo.userPic ? imgPath + userInfo.userPic : '/h5/images/icon_dotted.jpg'
    // const picPath = 'https://test-for-syslinked1.s3.cn-north-1.amazonaws.com.cn/'

    loadData()
    function loadData () {
      // log('senderId', senderId)
      // log('userId', userId)
      // log('orgId', orgId)
      $ajax('/messages/list?staffId=' + userId + '&orgId=' + orgId + '&senderId=' + senderId, 'get', '', function (res) {
        console.log(res)
        // const resData = res.data.rows.reverse()
        const resData = res.data.rows
        $('#name').text(userNickname)
        if (resData.length > 0) {
          let temp = ''
          resData.map(item => {
            // const authorPic = item.userPic ? imgPath + item.userPic : '/h5/images/icon_dotted.jpg'
            // const time = datetime2Str(new Date(item.createTime))
            const time = iosTimeFormtter(item.createTime)
            let imgTemp = ''
            if (item.fileurl) {
              imgTemp = `<img src="${imgPath}${item.fileurl}" class="chat-img" data-preview-src="" data-preview-group="1">`
            }
            let msgTemp = ''
            if (item.message) {
              msgTemp = `<div>${item.message}</div>`
            }
            temp += `<div class="flex mb-05" ><div class="flex mb-05">
              <div class="author-box">
                <img src="${authorPic}">
              </div>
              <div class="chat-box ml-05">
                <div class="chat-conter">${imgTemp}${msgTemp}</div>
                <div class="ft-12 text-default mt-02">${time}</div>
              </div>
            </div></div>`
          })
          $('#chatList').html(temp)
          scrollBottom()
          updateStatus()
        }
      })
    }

    function updateStatus () {
      $ajax('/messages/updatemessagestatus?orgId=' + orgId + '&userId=' + userId + '&senderId=' + senderId, 'get', '', function (res) {
        console.log(res)
      })
    }

    mui('body').on('tap', '#sendChat', function () {
      sendChat()
    })

    mui('body').on('change', '#file', function () {
      loadingShow()
      const file = this.files[0]
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData)
    })

    function uploadImg (formData) {
      $upload('/upload/fileuploadaws', 'post', formData, (res) => {
        mui.toast(res.msg)
        $('#file').val('')
        loadingHide()
        if (res.code === 1) {
          const params = {
            fileurl: res.data.url,
            // message: chatVal,
            orgId: orgId,
            senderId: userId,
            staffId: senderId
            // userNickname: userNickname,
            // userPic: userPic
          }
          const nowTime = datetime2Str(new Date())
          $ajax('/messages/save', 'post', params, function (res) { })
          console.log('res', res)
          const temp = `<div class="flex mb-05 flex-end">
              <div class="chat-box mr-05">
                <p class="chat-conter me-bg">
                  <img src="${imgPath}${res.data.url}" class="chat-img" data-preview-src="" data-preview-group="1">
                </p>
                <div class="ft-12 text-default mt-02 text-right">${nowTime}</div>
              </div>
              <div class="author-box">
                <img src="${authorPic}">
              </div>
            </div>`
          $('#chatList').append(temp)
        }
      })
    }

    function scrollBottom () {
      window.scrollTo(0, document.body.scrollHeight)
    }

    function sendChat () {
      console.log('send')
      const chatVal = $('#chatVal').val()
      const params = {
        // "fileurl": "string",
        message: chatVal,
        orgId: orgId,
        senderId: Number(userId),
        staffId: senderId
        // userNickname: userNickname,
        // userPic: userPic
      }
      const nowTime = datetime2Str(new Date())
      
      $ajax('/messages/save', 'post', params, function (res) {
        if (res.code === 1) {
          const temp = `<div class="flex mb-05 flex-end">
              <div class="chat-box mr-05">
                <p class="chat-conter me-bg">${chatVal}</p>
                <div class="ft-12 text-default mt-02 text-right">${nowTime}</div>
              </div>
              <div class="author-box">
                <img src="${authorPic}">
              </div>
            </div>`
          $('#chatList').append(temp)
          scrollBottom()
          $('#chatVal').val('')
        }
        console.log(res)
      })
    }
    mui.previewImage();
    mui('body').on('tap', '#back', function () {
      mui.back()
    })
  })
})(mui, document, jQuery);