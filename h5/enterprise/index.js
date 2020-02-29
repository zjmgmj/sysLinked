(function ($$, doc, $) {
  let userId = null
  window.setupWebViewJavascriptBridge(bridge => {
    bridge.callHandler('getUserId', '', (result) => {
      const resData = JSON.parse(result)
      userId = resData.userId
    })
  })

  function joinorglist() {
    $ajax('/org/joinorglist?userId=' + userId, 'get', '', function (res) {
      console.log(res)
      const resData = res.data
      let temp = ''
      resData.map((item) => {
        let pic = '/h5/images/icon_enterprise_grey.jpg'
        if (item.isdefault === 1) {
          localStorage.setItem('orgDefault', item.id)
          localStorage.setItem('project', JSON.stringify(item))
          pic = '/h5/images/icon_enterprise_blue.jpg'
        }
        let orgusertype = '进入'
        if (item.orgusertype === 1) {
          orgusertype = '退出'
        }
        let settingTemp = ''
        if (item.userid == userId) {
          // settingTemp = `<div class="setting-icon"><i class="icon iconfont text-white ft-20 iconicon-test11"></i></div>`
          settingTemp = `<div class="setting-icon"><i class="icon iconfont ft-20 iconicon-test11"></i></div>`
        }
        temp += `<li class="org-list" data-orgName="${item.orgName}" data-orgNum="${item.orgNum}" data-id="${item.id}">
          <div class="flex align-center flex-between org-list-content">
            <div class="flex align-center">
              <div class="pl-05 pr-05 check-org"><img src="${pic}" /></div>
              <p class="ft-14 f-grey ">${item.orgName}</p> 
            </div>
            <div class="ft-14 pr-05 options-btn">
              <div class="flex">
                ${settingTemp}
                <div class="delete ml-05"><i class="icon iconfont ft-20 iconicon-test9"></i></div>
              </div>              
            </div>
          </div>
        </li>`
        // temp += `<li class="org-list" data-orgName="${item.orgName}" data-orgNum="${item.orgNum}" data-id="${item.id}">
        //   <div class="flex align-center flex-between org-list-content">
        //     <div class="flex align-center">
        //       <div class="pl-05 pr-05 check-org"><img src="${pic}" /></div>
        //       <p class="ft-14 f-grey ">${item.orgName}</p> 
        //     </div>
        //     <div class="ft-14 pr-05 options-btn" data-orgusertype='${item.orgusertype}'>${orgusertype}</div>
        //   </div>
        //   <div class="options flex">            
        //     ${settingTemp}
        //     <div class="delete ml-05"><i class="icon iconfont text-white ft-20 iconicon-test9"></i></div>
        //   </div>
        // </li>`
      })
      $('#enterpriseContent').html(temp)
      // $('#enterpriseContent').html(temp + temp + temp + temp + temp)
      $('#btnBox').show()
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    })
  }

  function getuser() {
    // log(userId)
    $ajax('/user/getuser?userId=' + userId, 'get', '', function (res) {
      console.log(res)
      const resData = res.data
      localStorage.setItem('userInfo', JSON.stringify(resData))
      localStorage.setItem('userId', resData.userId)
      // $('#mailbox').text(resData.userEamil)
      $('#mailbox').text(resData.userEamil)
      $('#phone').text(resData.userLogin)
      $('#weChat').text(resData.userWechatopenid ? 'Bind' : 'Unbound')
      $('#weibo').text(resData.userWeiboopenid ? 'Bind' : 'Unbound')
      $('#dingTalk').text(resData.userDingdingopenid ? 'Bind' : 'Unbound')
      $('#apple').text(resData.userAppleopnid ? 'Bind' : 'Unbound')
      $('#authorImg').attr('src', imgPath + resData.userPic)
      $('#name').text(resData.userNickname)
      $('#role').text(resData.orgRoleName)
      // let tmp = `<img src="/h5/images/icon_enterprise_grey.jpg" />`
      if (resData.userNotice === 1) {
        $('#notificationSet').attr('src', '/h5/images/icon_enterprise_blue.jpg')
      } else { 
        $('#notificationSet').attr('src', '/h5/images/icon_enterprise_grey.jpg')
      }
      $('#notificationSet').attr('data-val', resData.userNotice)
      $('#reminder').text(resData.userReminder)
    })
  }



  function pulldownRefresh() {
    // userId = 87
    // getuser()
    // joinorglist()
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

    mui('#enterpriseContent').on('tap', '.org-list-content', function () {
      const node = $(this).parents('.org-list')
      mui.openWindow({
        url: '/h5/organizationMember/index.html?orgId=' + Number(node.attr('data-id')),
        id: 'organizationMember'
      })
      return false
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
        // localStorage.setItem('orgDefault', node.attr('data-id'))
        $('#notification').show()
        const node = $(this).parents('.org-list')
        const orgId = Number(node.attr('data-id'))
        $('#notification').attr('data-orgId', orgId)
      }
      return false
    })
    mui('#enterpriseContent').on('tap', '.check-org', function () {
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
      return false
    })

    // mui('#enterpriseContent').on('drag', '.org-list-content', function (event) {
    //   // const node = $(this).find('.org-list-content')[0]
    //   const newWidth = this.clientWidth + event.detail.deltaX
    //   this.style.width = (newWidth < minWidth ? minWidth : newWidth > maxWidth ? maxWidth : newWidth) + 'px'
    // })

    function updateOrg(params) {
      $ajax('/orguser/update', 'post', params, function (res) {
        // mui.toast(res.msg)
        if (res.code === 1) {
          joinorglist()
        }
        // console.log(res)
        // joinorglist()
        // projectClick
        window.setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler('setOrgId', JSON.stringify({
            defaultOrgId: params.orgId
          }), (result) => {
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

    mui('#enterpriseContent').on('tap', '.setting-icon', function () {
      const orgId = $(this).parents('.org-list').attr('data-id')
      mui.openWindow({
        url: '/h5/corporateInfor?id=' + orgId,
        id: 'corporateInfor'
      })
      return false
    })

    mui('#enterpriseContent').on('tap', '.delete', function () {
      const orgId = $(this).parents('.org-list').attr('data-id')
      // outorg(orgId)
      $('#notification').attr('data-orgId', orgId)
      $('#notification').show()
      return false
    })

    function outorg(orgId) {
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

    mui('body').on('tap', '#authorImg', function () {
      mui.openWindow({
        url: '/h5/enterprise/personalInfor.html',
        id: 'personalInfor'
      })
    })
    mui('body').on('tap', '#mailbox', function () {
      const userId = localStorage.getItem('userId')
      mui.openWindow({
        url: '/h5/enterprise/emailEdit.html?email=' + $('#mailbox').text() + '&userId=' + userId,
        id: 'mailbox'
      })
    })
    mui('body').on('tap', '#accountPassword', function () { 
      const userId = localStorage.getItem('userId')
      mui.openWindow({
        url: '/h5/enterprise/changePassword.html?userId=' + userId,
        id: 'changePassword'
      })
    })
    mui('body').on('tap', '#phone', function () {
      const userId = localStorage.getItem('userId')
      mui.openWindow({
        url: '/h5/enterprise/phoneEdit.html?phone=' + $('#phone').text() + '&userId=' + userId,
        id: 'phone'
      })
    })

    const pickButtons = ['cancel', 'sure']
    var languagePicker = new mui.PopPicker({
      buttons: pickButtons
    });
    const languageList = [{
      value: 'en',
      text: 'English'
    }, {
      value: 'zh',
      text: '中文'
    }]
    languagePicker.setData(languageList)
    mui('body').on('tap', '#selectLanguage', function () {
      // languagePicker.setSelectedValue('en')
      const me = this
      languagePicker.show(function (items) {
        $(me.children[0]).text(items[0].text)

        if (items[0].value === 'zh') {
          window.setupWebViewJavascriptBridge(bridge => {
            bridge.callHandler('setLanguage', items[0].value)
            mui.openWindow({
              url: '/h5/zh/enterprise/enterprise.html',
              id: 'enterprise'
            })
          })
        }
      });
    })
    mui('body').on('tap', '#weChat,#weibo,#dingTalk,#apple', function () {
      window.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler('thirdLogin', this.getAttribute('data-val'), () => {
          getuser()
        })
      })
    })
    mui('body').on('tap', '#notificationSet', function () { 
      const userId = localStorage.getItem('userId')
      let noticeStatus = this.getAttribute('data-val')
      if (noticeStatus == 1) {
        noticeStatus = 0
      } else { 
        noticeStatus = 1
      }
      const params = {
        userId: Number(userId),
        userNotice: noticeStatus
      }
      $ajax('/user/update', 'post', params, function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          if (noticeStatus === 1) {
            $('#notificationSet').attr('src', '/h5/images/icon_enterprise_blue.jpg')
          } else { 
            $('#notificationSet').attr('src', '/h5/images/icon_enterprise_grey.jpg')
          }
          $('#notificationSet').attr('data-val', noticeStatus)
        }
      })
    })
  });
})(mui, document, jQuery);