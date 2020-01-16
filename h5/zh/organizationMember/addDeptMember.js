(function ($$, doc, $) {
  let page = 1
  const size = 12
  const userId = 17
  const orgId = getUrlParam('orgId')
  let searchKey = ''
  // const type = getUrlParam('type')
  const id = getUrlParam('deptId')
  const typeId = '&deptId=' + id
  // const status = getUrlParam('status')
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
    const api = '/orguser/list?page=' + page + '&size=' + size + '&orgId=' + orgId + '&name=' + searchKey + typeId
    $ajax(api, 'get', '', function (res) {
      $('#pullrefresh').attr('data-page', page)
      $('#pullrefresh').attr('data-total', res.data.total)
      const resData = res.data.rows
      deptList(resData)
      if (page === 1) {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      }
    })
  }

  function deptList(resData) {
    let temp = ''
    resData.map((item) => {
      let checked = ""
      if (item.isdept) {
        checked = "checked"
      }
      temp += `<li class="border-b-grey member-item" data-userId="${item.userId}">
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
      orguserList()
    })

    mui('#memberList').on('tap', '.member-item', function () {
      const isChecked = $(this).find('input').attr('checked')
      $(this).find('input').attr('checked', !isChecked)
      const userId = this.getAttribute('data-userid')
      if (isChecked) {
        removeMember(userId)
      } else {
        addMember(userId)
      }
      return false
    })

    function removeMember(userId) {
      $ajax('/deptuser/delete?deptId=' + id + '&userId=' + userId, 'get', '', function (res) {
        console.log(res)
      })
    }

    function addMember(userId) {
      const params = {
        deptId: Number(id),
        userId: Number(userId)
      }
      $ajax('/deptuser/save', 'post', params, (res) => {
        console.log(res)
      })
    }

    mui('body').on('tap', '#addDeptShow', function () {
      mui.openWindow({
        url: '/h5/zh/organizationMember/addDeptMember.html',
        id: 'addDeptMember'
      })
    })

    mui('body').on('tap', '#back', function () {
      back()
    })
    orguserList()
  });
})(mui, document, jQuery);