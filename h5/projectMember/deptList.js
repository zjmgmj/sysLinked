(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const orgId = localStorage.getItem('orgDefault')
    const pid = JSON.parse(localStorage.getItem('project')).id
    loadData()
    function loadData () {
      $ajax('/dept/list?orgId=' + orgId, 'get', '', function (res) {
        if (res.code === 1) {
          console.log(res)
          let temp = ''
          res.data.map((item) => {
            temp += `<li class="flex flex-between text-grey ft-14 dept" data-id="${item.id}">
              <span>${item.deptName}</span>
              <span class="text-333">${item.num || 0}<i class="icon iconfont text-default ft-12">&#xe657;</i></span>
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
        url: '/h5/projectMember/members.html?deptId=' + deptId + '&projectId=' + pid + '&orgId=' + orgId,
        id: 'projectMembers'
      })
    })

    mui('body').on('tap', '.back', function () {
      mui.openWindow({
        url: '/h5/projectMember/projectMembers.html',
        id: 'projectMember'
      })
    })
  });
})(mui, document, jQuery);