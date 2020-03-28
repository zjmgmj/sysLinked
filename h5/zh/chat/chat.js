(function ($$, doc, $) {
  const size = 20
  let page = 1
  // const orgId = 32
  // const userId = 34
  const orgId = localStorage.getItem('orgDefault')
  const userId = localStorage.getItem('userId')
  // const picPath = 'https://test-for-syslinked1.s3.cn-north-1.amazonaws.com.cn/'
  function pulldownRefresh () {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    $('#memberList').html('')
    loadData()
  }
  function pullupRefresh () {
    // 上拉加载具体业务实现
    const total = $('#pullrefresh').attr('data-total')
    if (total == $('#memberList .member-item').length) {
      mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      return false
    }
    page = Number($('#pullrefresh').attr('data-page')) + 1
    loadData()
    console.log('pullupRefresh')
  }

  function loadData () {
    // staffId=34&orgId=87&size=50&page=1
    $ajax('/messages/list?size=' + size + '&page=' + page + '&orgId=' + orgId + '&staffId=' + userId, 'get', '', (res) => {
      console.log('---s', res)
      if (res.code === 1) {
        $('#pullrefresh').attr('data-page', page)
        $('#pullrefresh').attr('data-total', res.data.total)
        let temp = ''
        const resData = res.data.rows
        resData.map((item) => {
          const authorPic = item.userPic ? imgPath + item.userPic : '/h5/images/icon_dotted.jpg'
          const time = datetime2Str(new Date(item.createTime))
          let statusTemp = ''
          if (item.status === 0) {
            statusTemp = `<p><span class="dotted fr"></span></p>`
          }
          temp += `<li class="border-b-grey flex flex-between">                                  
              <div class="store">
                <div class="chat-avator fl"><img src="${authorPic}" /></div>
                <div class="chat-info fl">
                  <p class="ft-16 f-grey">${item.userNickname}</p>
                  <p class="ft-12 text-grey">${item.message || ''}</p>
                </div>
              </div>
              <div class="chat-time ft-12 text-grey">
                <p>${time}</p>
                ${statusTemp}
              </div>
            </li>`
        })
        $('#chatList').html(temp)
        if (page === 1) {
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        } else {
          mui('#pullrefresh').pullRefresh().endPullupToRefresh();
        }
      }
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    })
  }
  mui.init({
    pullRefresh: {
      container: '#pullrefresh',
      down: {
        callback: pulldownRefresh
      },
      up: {
        contentrefresh: '正在加载...',
        callback: pullupRefresh
      }
    }
  });
  mui.ready(function () {
    loadData()
    mui('body').on('tap', '.tab', function () {
      const active = this.getAttr('data-active')
      if (active === 0) {
        $('#noticeList').show()
        $('#chatList').hide()
      } else {
        $('#noticeList').hide()
        $('#chatList').show()
      }
      $('#pullrefresh').attr('data-active', active)
      loadData()
    })
  })
})(mui, document, jQuery);
