(function ($$, doc, $) {
  let page = 1
  const size = 12
  let userId = localStorage.getItem('userId')
  // window.setupWebViewJavascriptBridge(bridge => {
  //   bridge.callHandler('getUserId', '', (result) => {
  //     const resData = JSON.parse(result)
  //     userId = resData.userId
  //     orguserList()
  //   })
  // })
  // const orgId = 39
  // let searchKey = ''  
  const type = getUrlParam('type')
  const id = getUrlParam(type)
  const typeId = '&' + type + '=' + id
  const status = getUrlParam('status')
  const pid = getUrlParam('pid')
  const orgId = getUrlParam('orgId')
  // localStorage.getItem('orgDefault')

  const title = getUrlParam('title') || 'All Members'
  $('#title').text(title)
  // const deptId = getUrlParam('deptId')
  orguserList()

  function pulldownRefresh() {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    $('#memberList').html('')
    orguserList()
  }

  function pullupRefresh() {
    // 上拉加载具体业务实现
    console.log('pullupRefresh')
    const total = $('#pullrefresh').attr('data-total')
    if (total == $('#memberList .member-item').length) {
      mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      return false
    }
    page = Number($('#pullrefresh').attr('data-page')) + 1
    orguserList()
  }

  function orguserList() {
    const searchKey = $('#searchInput').val()
    // let api = '/orguser/list?page='+page+'&size='+size+ '&name='+searchKey + typeId
    let api = '/deptuser/getdeptuserlist?page=' + page + '&size=' + size + '&orgId=' + orgId + typeId
    if (type === 'orgId') {
      api = '/orguser/list?page=' + page + '&size=' + size + '&name=' + searchKey + typeId + '&status=' + status
    }
    $ajax(api, 'get', '', function (res) {
      console.log(res)
      $('#pullrefresh').attr('data-page', page)
      $('#pullrefresh').attr('data-total', res.data.total)
      const resData = res.data.rows
      localStorage.setItem('userlist', JSON.stringify(resData))
      if (type === 'deptId') {
        deptList(resData)
      } else {
        orgList(resData)
      }
      if (page === 1) {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      }
    })
  }

  function deptList(resData) {
    let temp = ''
    resData.map((item, index) => {
      temp += `<li class="border-b-grey member-item" data-userId="${item.userId}" data-index="${index}">
        <div class="flex align-center">
          <div class="avator border-blue radius-b50"><img src="/h5/images/avator.png" /></div>
          <div class="member-info">
            <p class="name ft-16">${item.userNickname}</p>
            <p class="email ft-12">${item.userEamil}</p>
          </div>
        </div>
      </li>`
    })
    $('#memberList').append(temp)
  }

  function orgList(resData) {
    let temp = ''
    resData.map((item, index) => {
      // temp += `<li class="border-b-grey member-item">
      //   <div class="flex align-center">
      //     <div class="avator border-blue radius-b50"><img src="../images/avator.png" /></div>
      //     <div class="member-info">
      //       <p class="name ft-16">${item.userNickname}</p>
      //       <p class="email ft-12">${item.userEamil}</p>
      //     </div>
      //   </div>
      // </li>`
      // <div class="check-box"><input type="checkbox" checked="checked"/></div>
      const status = item.status === 0 ? '未分配' : item.status === 1 ? '已分配' : '已停用'
      temp += `<li class="border-b-grey member-item" data-userId="${item.userId}"  data-index="${index}">
      <div class="flex align-center flex-between">        
        <div class="flex align-center">
          <div class="avator border-blue radius-b50"><img src="/h5/images/avator.png" /></div>
          <div class="member-info">
            <p class="email ft-12">${item.userId}</p>
            <p class="name ft-16">
              <span>${item.userNickname}</span>
              <span class="ft-12">(${item.orgRoleName})</span>
            </p>            
          </div>
        </div>
        <div class="ft-12">${status}</div >
      </div >
    </li > `
    })
    $('#memberList').append(temp)
  }
  mui.init({
    pullRefresh: {
      container: '#pullrefresh',
      down: {
        contentdown: "Pull down to refresh",
        contentover: "Refresh immediately",
        contentrefresh: "loading",
        callback: pulldownRefresh
      },
      up: {
        contentrefresh: "loading",
        contentnomore: 'No more',
        callback: pullupRefresh
      }
    }
  });
  mui.ready(function () {
    if (type === 'deptId') {
      $('#deptOption').show()
    }
    // mui('body').on('input', '#searchInput', function () {
    //   console.log('-------1')
    //   $('#memberList').html('')
    //   page = 1
    //   orguserList()
    // })

    $('#searchInput').change(() => {
      $('#memberList').html('')
      page = 1
      orguserList()
    })

    // $('#searchInput').on('input', function () {
    //   $('#memberList').html('')
    //   page = 1
    //   console.log('--1')
    //   orguserList()
    //   return false
    // })

    mui('#memberList').on('tap', '.member-item', function () {
      // localStorage.setItem('projectuserDetail', JSON.stringify(detail))
      const idx = this.getAttribute('data-index')
      const params = JSON.parse(localStorage.getItem('userlist'))
      const detail = params[idx]
      // detail.pid = pid
      localStorage.setItem('projectuserDetail', JSON.stringify(detail))
      console.log(this)
      mui.openWindow({
        url: '/h5/projectMember/memberInfo.html',
        id: 'memberInfo'
      })
      // if (type === 'orgId') {
      //   const isChecked = $(this).find('input').attr('checked')
      //   $(this).find('input').attr('checked', !isChecked)
      // const userId = this.getAttribute('data-userid')
      // $ajax('/projectuser/delete?id='+userId, 'get', '', function(res) {
      //   console.log(res)
      //   if (res.code === 1) {
      //     $('#memberList').html('')
      //     orguserList()
      //   }
      //   mui.toast(res.msg)
      // })
      // }
      // const params = {
      //   deptId: Number(id),
      //   userId: Number(this.getAttribute('data-userid'))
      // }
      // $ajax('/deptuser/save', 'post', params, (res) => {
      //   console.log(res)
      // })
      return false
    })

    mui('body').on('tap', '#deptOption', function () {
      $('.popup').show()
    })

    mui('.popup').on('tap', '#inviteMembers', function () {
      mui.openWindow({
        url: '/h5/organizationMember/addDeptMember.html?deptId=' + id + '&orgId=' + orgId,
        id: 'addDeptMember'
      })
    })

    mui('.popup').on('tap', '#delete', function () {
      $ajax('/dept/delete?id=' + id, 'get', '', function (res) {
        console.log(res)
        if (res.code === 1) {
          // mui.back()
          back()
        }
      })
    })
    mui('body').on('tap', '.opacity-bg', function () {
      $('.popup').hide()
    })

    // mui('.popup').on('tap', '#edit', function() {
    //   const params = {
    //     createUserid: userId,
    //     deptName: '',
    //     id: '',
    //     orgId: '',
    //     num: ''
    //   }
    //   $ajax('/dept/update', 'post', params, function(res) {
    //     console.log(res)
    //   })
    // })

    mui('body').on('tap', '#back', function () {
      // back()
      mui.back()
      // mui.openWindow({
      //   url: '/organizationMember/',
      //   id: 'organizationMember'
      // })
    })
    // orguserList()
  });
})(mui, document, jQuery);