(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const orgId = localStorage.getItem('orgDefault')
    const pid = JSON.parse(localStorage.getItem('project')).id
    loadData()
    function loadData () {
      $ajax('/dept/getdeptusercountlist?orgId=' + orgId, 'get', '', function (res) {
        if (res.code === 1) {
          console.log(res)
          let temp = ''
          res.data.map((item) => {
            temp += `<li class="flex flex-between text-grey ft-14 dept" data-id="${item.id}">
              <span>${item.deptName}</span>
              <span class="text-333">${item.num}<i class="icon iconfont text-default ft-12">&#xe657;</i></span>
            </li>`
          })
          $('#deptList').html(temp)
        }
      })
    }

    mui('#deptList').on('tap', '.dept', function () {
      console.log(this)
      const deptId = this.getAttribute('data-id')
      mui.openWindow({
        url: '/h5/projectMember/members.html?deptId=' + deptId + '&projectId=' + pid,
        id: 'projectMembers'
      })
    })

    mui('body').on('tap', '.back', function () {
      // back()
      mui.openWindow({
        url: '/h5/projectMember',
        id: 'projectMember'
      })
    })
  });
})(mui, document, jQuery);