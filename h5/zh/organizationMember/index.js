(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    // const page = 1
    // const size = 12
    // const orgId = 39
    // const orgId = getUrlParam('orgId') ? getUrlParam('orgId') : localStorage.getItem('orgDefault')
    const orgId = getUrlParam('orgId')
    // alert('orgId:' + orgId)
    const pid = JSON.parse(localStorage.getItem('project')).id
    // const deptId = 7
    // const pid = 38
    getcompanyusercount()

    function getcompanyusercount() {
      $ajax('/orguser/getcompanyusercount?orgId=' + orgId, 'get', '', function (res) {
        console.log(res)
        let allNum = 0
        let unassignedNum = 0
        let deactivatedNum = 0
        res.data.map(item => {
          if (item.orguserstatus === 2) {
            deactivatedNum += item.orgusercount
          } else if (item.orguserstatus === 0) {
            unassignedNum += item.orgusercount
          }
          allNum += item.orgusercount
        })
        $('#allNum').text(allNum)
        $('#unassignedNum').text(unassignedNum)
        $('#deactivatedNum').text(deactivatedNum)
      })
    }
    deptList()

    function deptList() {
      $ajax('/dept/list?orgId=' + orgId, 'get', '', function (res) {
        console.log(res)
        // getdeptusercountlist(res.data)
        let temp = ''
        const resData = res.data
        resData.map((item) => {
          const num = item.num || 0
          temp += `<li class="flex flex-between text-grey ft-14 dept" data-type="deptId" data-id="${item.id}">
            <span>${item.deptName}</span>
        <span class="text-333">${num}<i class="icon iconfont text-default ft-12">&#xe657;</i></span>
          </li>`
        })
        $('#deptList').html(temp)
      })
    }

    function getdeptusercountlist(deptList) {
      $ajax('/dept/getdeptusercountlist?orgId=' + orgId, 'get', '', function (res) {
        console.log(res)
        let temp = ''
        const resData = res.data
        deptList.map((item) => {
          let resObj = resData.find((resItem) => {
            return resItem.id === item.id
          })
          if (!resObj) {
            resObj = {
              num: 0
            }
          }
          temp += `<li class="flex flex-between text-grey ft-14 dept" data-type="deptId" data-id="${item.id}">
            <span>${item.deptName}</span>
        <span class="text-333">${resObj.num}<i class="icon iconfont text-default ft-12">&#xe657;</i></span>
          </li>`
        })
        $('#deptList').html(temp)
      })
    }

    mui('body').on('tap', '.opacity-bg', function () {
      $('.popup').hide()
    })

    mui('body').on('tap', '#optionShow', function () {
      console.log(this)
      $('#optionBox').show()
    })

    mui('.popup').on('tap', '#inviteMembers', function () {
      mui.openWindow({
        url: '/h5/zh/organizationMember/createInvite.html',
        id: 'createInvite'
      })
    })

    mui('.popup').on('tap', '#createDeptShow', function () {
      $('#createDept').show()
      $('#optionBox').hide()
    })

    mui('.popup').on('tap', '#determine', function () {
      const params = {
        deptName: $('#deptName').val(),
        orgId: orgId
      }
      $ajax('/dept/save', 'post', params, function (res) {
        console.log(res)
        $('#createDept').hide()
        deptList()
      })
    })

    mui('.popup').on('tap', '#cancel', function () {
      $('#createDept').hide()
    })

    mui('.organization').on('tap', '.member-li', function () {
      const type = this.getAttribute('data-type')
      const status = this.getAttribute('data-status')
      let title = 'All Members'
      if (status === '2') {
        title = 'Deactivated Members'
      } else if (status === '0') {
        title = 'Unassigned Members'
      }
      mui.openWindow({
        url: '/h5/zh/organizationMember/members.html?type=' + type + '&orgId=' + orgId + '&status=' + status + '&title=' + title,
        id: 'membersList'
      })
    })

    mui('#deptList').on('tap', '.dept', function () {
      const type = this.getAttribute('data-type')
      const deptId = this.getAttribute('data-id')
      mui.openWindow({
        url: '/h5/zh/organizationMember/members.html?type=' + type + '&orgId=' + orgId + '&deptId=' + deptId + '&pid=' + pid,
        id: 'deptMemberList'
      })
    })
    mui('body').on('tap', '#back', function () {
      mui.back()
    })
    // orguserList()
    // function orguserList() {
    //   $ajax('/orguser/list?orgId='+orgId+'&page='+page+'&size='+size, 'get', '', function(res) {
    //     console.log(res)
    //   })
    // }
  });
})(mui, document, jQuery);