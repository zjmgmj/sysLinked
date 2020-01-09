(function ($$, doc, $) {
  let page = 1
  const size = 12
  const createUserId = localStorage.getItem('userId')
  const deptId = getUrlParam('deptId')
  const pid = getUrlParam('projectId')
  function pulldownRefresh () {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    $('#memberList').html('')
    deptuserList()
  }
  function pullupRefresh () {
    // 上拉加载具体业务实现
    console.log('pullupRefresh')
    const total = $('#pullrefresh').attr('data-total')
    if (total == $('#memberList .member-item').length) {
      mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      return false
    }
    page = Number($('#pullrefresh').attr('data-page')) + 1
    deptuserList()
  }
  function deptuserList () {
    // const searchKey = $('#searchInput').val()
    let api = '/deptuser/getdeptuserlist?size=' + size + '&page=' + page + '&deptId=' + deptId + '&projectId=' + pid
    $ajax(api, 'get', '', function (res) {
      console.log(res)
      $('#pullrefresh').attr('data-page', page)
      $('#pullrefresh').attr('data-total', res.data.total)
      const resData = res.data.rows
      orgList(resData)
      if (page === 1) {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      }
    })
  }

  function orgList (resData) {
    let temp = ''
    resData.map((item) => {
      let checked = ""
      if (item.isproject) {
        checked = "checked"
      }
      temp += `<li class="border-b-grey member-item" data-userId="${item.userId}" data-projectUserId="${item.projectUserId}">
        <div class="flex align-center">
          <div class="check-box"><input type="checkbox" ${checked}/></div>
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
    mui('body').on('input', '#searchInput', function () {
      console.log('-------1')
      $('#memberList').html('')
      page = 1
      deptuserList()
    })

    mui('#memberList').on('tap', '.member-item', function () {
      const isChecked = $(this).find('input').attr('checked')
      $(this).find('input').attr('checked', !isChecked)
      const userId = this.getAttribute('data-userid')
      if (isChecked) {
        projectuserDelete(this.getAttribute('data-projectUserId'))
      } else {
        const params = {
          createUserid: createUserId,
          projectId: Number(pid),
          userId: Number(userId)
        }
        projectUserSave(params)
      }
      return false
    })

    function projectuserDelete (userId) {
      $ajax('/projectuser/delete?id=' + userId, 'get', '', function (res) {
        console.log(res)
        mui.toast(res.msg)
      })
    }

    function projectUserSave (params) {
      $ajax('/projectuser/save', 'post', params, function (res) {
        mui.toast(res.msg)
      })
    }

    mui('body').on('tap', '#deptOption', function () {
      $('.popup').show()
    })

    mui('.popup').on('tap', '#inviteMembers', function () {
      mui.openWindow({
        url: '/h5/organizationMember/addDeptMember.html?deptId=' + id,
        id: 'addDeptMember'
      })
    })

    mui('.popup').on('tap', '#delete', function () {
      $ajax('/dept/delete?id=' + id, 'get', '', function (res) {
        console.log(res)
        if (res.code === 1) {
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
      mui.openWindow({
        url: '/h5/projectMember/deptList.html',
        id: 'deptList'
      })
    })
    deptuserList()
  });
})(mui, document, jQuery);