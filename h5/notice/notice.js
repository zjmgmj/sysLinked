(function ($$, doc, $) {
  const size = 10
  let page = 1
  const orgId = localStorage.getItem('orgDefault')
  const userId = localStorage.getItem('userId')
  // const picPath = 'https://test-for-syslinked1.s3.cn-north-1.amazonaws.com.cn/'
  function pulldownRefresh() {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    // const page = Number($('#pulldownRefresh').attr('data-page'))

    // $ajax('/project/detail?id='+ id , 'get', '', (res) => {
    page = 1
    const active = $('#pullrefresh').attr('data-active')
    if (active === '1') {
      $('#chatList').html('')
    } else {
      $('#noticeList').html('')
    }
    loadData()
  }

  function pullupRefresh() {
    // 上拉加载具体业务实现
    const total = $('#pullrefresh').attr('data-total')
    if (Number(total) == $('#noticeList li').length) {
      mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      return false
    }
    page = Number($('#pullrefresh').attr('data-page')) + 1
    loadData()
    console.log('pullupRefresh')
  }

  function loadData() {
    window.setupWebViewJavascriptBridge(bridge => {
      bridge.callHandler('getUserId', '', (result) => {
        const resData = JSON.parse(result)
        userId = resData.userId
        localStorage.setItem('userId', userId)
        // log('userId', userId)
      })
      bridge.callHandler('getOrgId', '', (result) => {
        const resData = JSON.parse(result)
        orgId = resData.orgId
        localStorage.setItem('orgDefault', orgId)
        // log('orgId', orgId)
      })
    })
    // log('userIdorgId', userId + '--' + orgId)
    const active = $('#pullrefresh').attr('data-active')
    let api = '/notice/list?page=' + page + '&size=' + size + '&orgId=' + orgId + '&userId=' + userId
    if (active === '1') {
      api = '/messages/getgruopuserlist?size=' + size + '&page=' + page + '&orgId=' + orgId + '&staffId=' + userId
    }
    $ajax(api, 'get', '', (res) => {
      console.log(res)
      if (res.code === 1) {
        $('#pullrefresh').attr('data-page', page)
        $('#pullrefresh').attr('data-total', res.data.total)
        const resData = res.data.rows
        if (active === '0') {
          noticeList(resData)
        } else {
          chatList(resData)
        }
      }
      if (page === 1) {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        mui('#pullrefresh').pullRefresh().refresh(true);
      }
      // else {
      //   // mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      //   mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      // }
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); // 下拉刷新
      mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      // mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    })
  }

  function noticeList(resData) {
    let temp = ''
    resData.map((item) => {
      const authorPic = item.userPic ? imgPath + item.userPic : '/h5/images/icon_dotted.jpg'
      // const time = datetime2Str(new Date(item.messagesDate))
      const time = iosTimeFormtter(item.messagesDate)
      let imgTempBox = ''
      if (item.fileurl) {
        const imgPathList = item.fileurl.split(',')
        let imgTemp = ''
        imgPathList.map((item) => {
          if (item) {
            imgTemp += `<span class="img-box"><img src="${imgPath}${item}" data-preview-src="" data-preview-group="${item.id}"/></span>`
          }
        })
        imgTempBox = `<div class="notice-picture flex pt-05">${imgTemp}</div>`
      }
      // log(new Date(item.messagesDate))
      temp += `<li class="border-b-grey flex">
        <div class="notice-avator"><img src="${authorPic}" /></div>
        <div class="notice-info col ml-05">
          <div class="flex flex-between line-height-20">
            <p class="ft-16 f-grey">${item.userNickname}</p>
            <p class="ft-12 text-grey">${time}</p>
          </div>
          <p class="ft-12 text-grey pt-05">${item.messages}</p>
          ${imgTempBox}
        </div>
      </li>`
    })
    $('#noticeList').append(temp)
  }

  function chatList(resData) {
    let temp = ''
    resData.map((item) => {
      const authorPic = item.userPic ? imgPath + item.userPic : '/h5/images/icon_dotted.jpg'
      // const time = iosTimeFormtter(item.createTime)
      let statusTemp = ''
      if (item.noreadCount > 0) {
        // statusTemp = `<p><span class="dotted fr"></span></p>`
        statusTemp = `<p class="noread-count">${item.noreadCount}</p>`
      }
      temp += `<li class="relative border-b-grey flex flex-between chat-item align-center" data-staffId="${item.senderId}">
          <div class="store flex align-center">
            <div class="chat-avator"><img src="${authorPic}" /></div>
            <div class="chat-info">
              <p class="ft-16 f-grey">${item.userNickname}</p>
            </div>
          </div>
          <div class="chat-time ft-12 text-grey">
            ${statusTemp}
          </div>
        </li>`
    })
    $('#chatList').html(temp)
  }
  mui.init({
    gestureConfig: {
      longtap: true
    },
    pullRefresh: {
      container: '#pullrefresh',
      down: {
        callback: pulldownRefresh
      },
      up: {
        auto: true,
        contentrefresh: '正在加载...',
        callback: pullupRefresh
      }
    }
  });
  mui.ready(function () {
    // loadData()
    mui('body').on('tap', '.tab', function () {
      const active = this.getAttribute('data-active')
      $('.tab em').removeClass('on')
      $(this).find('em').addClass('on')
      if (active === '0') {
        $('#noticeList').html('')
        $('#noticeList').show()
        $('#chatList').hide()
      } else {
        $('#chatList').html('')
        $('#noticeList').hide()
        $('#chatList').show()
      }
      $('#pullrefresh').attr('data-active', active)
      page = 1
      loadData()
    })

    mui('#chatList').on('tap', '.chat-item', function () {
      const staffId = this.getAttribute('data-staffId')
      mui.openWindow({
        url: '/h5/zh/chat/chatDetail.html?staffId=' + staffId,
        id: 'chatDetail'
      })
    })

    mui('#chatList').on('longtap', '.chat-item', function () {
      $('#notification').show()
      $('#notification').attr('data-senderId', this.getAttribute('data-staffid'))
      // $('.chat-item').removeClass('longtap')
      // $(this).addClass('longtap')
    })
    mui('#notification').on('tap', '#determine', function () {
      const senderId = $(this).parents('#notification').attr('data-senderId')
      $ajax(`/messages/deleteall?userId=${userId}&senderId=${senderId}&orgId=${orgId}`, 'get', '', function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          pulldownRefresh()
        }
      })
      $('#notification').hide()
    })
    mui('#notification').on('tap', '#cancel,.opacity-bg', function () {
      $('#notification').hide()
    })
    mui.previewImage();
  })
})(mui, document, jQuery);