(function ($$, doc, $) {
  const page = 1
  const size = 150
  let pid = null

  function loadData() {
    $ajax('/projectuser/getprojectuserlist?page=' + page + '&size=' + size + '&projectId=' + pid, 'get', '', function (res) {
      const resData = res.data.rows
      localStorage.setItem('projectuserlist', JSON.stringify(resData))
      let temp = ''
      resData.map((item, index) => {
        temp += `<li class="border-b-grey flex flex-between align-center member-item" data-id="${item.projectUserId}" data-index="${index}">
          <div class="flex col">
          <div class="avator border-blue radius-b50">        
            <img src="${item.userPic !== 'null' && item.userPic ? imgPath + item.userPic : '/h5/images/avatar.png'}" alt="sysLinked" />            
          </div>
          <div class="member-info col">
            <p class="name ft-16">${item.userNickname}</p>
            <p class="email ft-12">${item.userEamil}</p>
          </div>
          </div>
          <div id="remove">remove</div>
        </li>`
      })
      $('#adminList').html(temp)
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      setTimeout(() => { 
        getPermissionProject()
      }, 100)
    })
  }

  function pulldownRefresh() {
    $('#projectMembers #optionShow').hide()
    pid = '10098'
    loadData()
    // window.setupWebViewJavascriptBridge(bridge => {
    //   bridge.callHandler('getProjectId', '', (result) => {
    //     const resData = JSON.parse(result)
    //     pid = resData.projectId
    //     loadData()
    //   })
    // })
  }
  mui.init({
    pullRefresh: {
      container: '#pullrefresh', //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        contentdown: "Pull down to refresh",
        contentover: "Refresh immediately",
        contentrefresh: "loading",
        auto: true,
        style: 'circle',
        callback: pulldownRefresh
      }
    }
  });
  // mui.init();
  mui.ready(function () {
    // loadData()
    mui('body').on('tap', '#optionShow', function () {
      $('.popup').show()
    })

    mui('.member-list').on('tap', '.del-list', function () {
      // const id = this.getAttribute('data-id')
      const id = $(this).parents('.member-item').attr('data-id')
      $ajax('/projectuser/delete?id=' + id, 'get', '', function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          loadData()
        }
      })
      return false
    })

    mui('.member-list').on('tap', '.member-item', function () {
      // const resData = JSON.parse(result)
          // const params = JSON.parse(localStorage.getItem('projectuserlist'))
          // const idx = this.getAttribute('data-index')
          // const detail = params[idx]
          // pid = 10098
          // detail.pid = pid
          // localStorage.setItem('projectuserDetail', JSON.stringify(detail))
          // mui.openWindow({
          //   url: '/h5/projectMember/memberInfo.html',
          //   id: 'memberInfo'
          // })
      window.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler('getProjectId', '', (result) => {
          const resData = JSON.parse(result)
          const params = JSON.parse(localStorage.getItem('projectuserlist'))
          const idx = this.getAttribute('data-index')
          const detail = params[idx]
          pid = resData.id
          detail.pid = pid
          localStorage.setItem('projectuserDetail', JSON.stringify(detail))
          mui.openWindow({
            url: '/h5/projectMember/memberInfo.html',
            id: 'memberInfo'
          })
        })
      })
    })


    mui('body').on('tap', '.opacity-bg', function () {
      $('.popup').hide()
    })

    mui('body').on('tap', '#inviteMembers', function () {
      mui.openWindow({
        url: '/h5/projectMember/inviteMembers.html',
        id: 'inviteMembers'
      })
    })
    mui('body').on('tap', '#batchImport', function () {
      mui.openWindow({
        url: '/h5/projectMember/batchImport.html',
        id: 'batchImport'
      })
    })
    mui('#adminList').on('tap', '#remove', function () { 
      const id = this.parentElement.getAttribute('data-id')
      $ajax('/projectuser/delete?id=' + id, 'get', '', function (res) {
        mui.toast(res.msg)
        pulldownRefresh()
      })
      return false
    })
  });
})(mui, document, jQuery);