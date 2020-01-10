(function ($$, doc, $) {
  let userId = null
  window.setupWebViewJavascriptBridge(bridge => {
    bridge.callHandler('getUserId', '', (result) => {
      const resData = JSON.parse(result)
      userId = resData.userId
    })
  })
  function joinorglist () {
    $ajax('/org/joinorglist?userId=' + userId, 'get', '', function (res) {
      console.log(res)
      const resData = res.data
      let temp = ''
      resData.map((item) => {
        let pic = '/h5/images/icon_enterprise_grey.jpg'
        if (item.isdefault === 1) {
          pic = '/h5/images/icon_enterprise_blue.jpg'
        }
        let orgusertype = '进入'
        if (item.orgusertype === 1) {
          orgusertype = '退出'
        }
        temp += `<li class="org-list" data-orgName="${item.orgName}" data-orgNum="${item.orgNum}" data-id="${item.id}">
          <div class="flex align-center flex-between org-list-content">
            <div class="flex align-center">
              <div class="pl-05 pr-05"><img src="${pic}" /></div>
              <p class="ft-14 f-grey ">${item.orgName}</p> 
            </div>
            <div class="ft-14 pr-05 options-btn" data-orgusertype='${item.orgusertype}'>${orgusertype}</div>
          </div>
          <div class="options flex">
            <div class="setting-icon"><i class="icon iconfont text-white ft-20 iconicon-test11"></i></div>
            <div class="delete ml-05"><i class="icon iconfont text-white ft-20 iconicon-test9"></i></div>
          </div>
        </li>`
      })
      $('#enterpriseContent').html(temp)
      $('#btnBox').show()
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    })
  }
  function getuser () {
    $ajax('/user/getuser?userId=' + userId, 'get', '', function (res) {
      console.log(res)
      const resData = res.data
      localStorage.setItem('userInfo', JSON.stringify(resData))
      // $('#mailbox').text(resData.userEamil)
      $('#mailbox').text(resData.userEamil)
      $('#phone').text(resData.userLogin)
      // $('#weChat').text(resData.userLogin)
      // $('#weibo').text(resData.userLogin)
      // $('#dingTalk').text(resData.userLogin)
      $('#authorImg').attr('src', imgPath + resData.userPic)
      $('#name').text(resData.userNickname)
      $('#role').text(resData.orgRoleName)
    })
  }
  function pulldownRefresh () {
    // userId = localStorage.getItem('userId')
    window.setupWebViewJavascriptBridge(bridge => {
      bridge.callHandler('getUserId', '', (result) => {
        const resData = JSON.parse(result)
        userId = resData.userId
        getuser()
        joinorglist()
      })
    })
  }
  mui.init(muiInit('#pullrefresh', pulldownRefresh));
  mui.ready(function () {
    // window.setupWebViewJavascriptBridge(bridge => {
    //   bridge.callHandler('getUserId', '', (result) => {
    //     const resData = JSON.parse(result)
    //     userId = resData.userId
    //     localStorage.setItem('userId', userId)
    //     getuser()
    //     joinorglist()
    //   })
    // })
    // getuser()
    // joinorglist()
    // const userId = 39

    // window.setupWebViewJavascriptBridge(bridge => {
    //   bridge.callHandler('getUserId', '', (result) => {
    //     const resData = JSON.parse(result)
    //     userId = resData.userId
    //     joinorglist()
    //   })
    // })
    const minWidth = window.innerWidth * 0.6
    let maxWidth = $('#enterpriseContent')[0].clientWidth
    mui('body').on('tap', '#createBusiness', function () {
      // console.log(this)
      mui.openWindow({
        url: '/h5/enterprise/createEnterprise.html',
        id: 'createEnterprise'
      })
    })

    mui('#enterpriseContent').on('tap', '.options-btn', function () {
      const orgusertype = this.getAttribute('data-orgusertype')
      if (orgusertype === '0') {
        const node = $(this).parents('.org-list')
        mui.openWindow({
          url: '/h5/organizationMember/index.html?orgId=' + Number(node.attr('data-id')),
          id: 'organizationMember'
        })
      } else {
        localStorage.setItem('orgDefault', node.attr('data-id'))
        $('#notification').show()
        const node = $(this).parents('.org-list')
        const orgId = Number(node.attr('data-id'))
        $('#notification').attr('data-orgId', orgId)
      }
      return false
    })
    mui('#enterpriseContent').on('tap', '.org-list-content', function () {
      console.log(this)
      // outorg()
      const node = $(this).parents('.org-list')
      const orgId = Number(node.attr('data-id'))
      localStorage.setItem('orgDefault', JSON.stringify(orgId))
      // alert('测试' + orgId)
      const params = {
        orgId: orgId,
        isdefault: 1,
        orgName: node.attr('data-orgName'),
        orgNum: node.attr('data-orgNum'),
        userId: userId
      }
      updateOrg(params)
    })

    // mui('#enterpriseContent').on('drag', '.org-list-content', function (event) {
    //   // const node = $(this).find('.org-list-content')[0]
    //   const newWidth = this.clientWidth + event.detail.deltaX
    //   this.style.width = (newWidth < minWidth ? minWidth : newWidth > maxWidth ? maxWidth : newWidth) + 'px'
    // })

    function updateOrg (params) {
      $ajax('/orguser/update', 'post', params, function (res) {
        // mui.toast(res.msg)
        if (res.code === 1) {
          joinorglist()
        }
        // console.log(res)
        // joinorglist()
        // projectClick
        window.setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler('setOrgId', JSON.stringify({ defaultOrgId: params.orgId }), (result) => {
            // const resData = JSON.parse(result)
            // userId = resData.userId
            // orguserList()
          })
        })
        // mui.openWindow({
        //   url: '/organizationMember/index.html',
        //   id: 'organizationMember'
        // })
      })
    }



    // mui('#enterpriseContent').on('tap', '.delete', function () {
    //   const orgId = $(this).parents('.org-list').attr('data-id')
    //   outorg(orgId)
    // })

    function outorg (orgId) {
      // const orgId = 38
      $ajax('/orguser/outorg?orgId=' + orgId + '&userId=' + userId, 'get', '', function (res) {
        console.log(res)
        // mui.toast(res.msg)
        $('#notification').hide()
        joinorglist()
      })
    }




    mui('body').on('tap', '#enterprise', function () {
      $(this).addClass('on')
      $('#settings').removeClass('on')
      $('#enterpriseContent').show()
      $('.create-business').show()
      $('#settingContent').hide()
      $('.sign-out').hide()
    })

    mui('body').on('tap', '#settings', function () {
      $(this).addClass('on')
      $('#enterprise').removeClass('on')
      $('#enterpriseContent').hide()
      $('.create-business').hide()
      $('#settingContent').show()
      $('.sign-out').show()
    })

    mui('#notification').on('tap', '#determine', function () {
      const orgId = $(this).parents('#notification').attr('data-orgId')
      outorg(orgId)
    })

    mui('#notification').on('tap', '#cancel, .opacity-bg', function () {
      $('#notification').hide()
    })

    mui('body').on('tap', '#signOut', function () {
      window.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler('logout', 'logout', function () {
          localStorage.clear();
        })
      })
    })
  });
})(mui, document, jQuery);