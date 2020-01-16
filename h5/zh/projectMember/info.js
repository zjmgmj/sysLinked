(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const orgId = localStorage.getItem('orgDefault')
    const info = JSON.parse(localStorage.getItem('projectuserDetail'))
    // const url = 'https://test-for-syslinked1.s3.cn-north-1.amazonaws.com.cn/'

    initData()

    function initData() {
      $('#authorPicMax').attr('src', imgPath + info.userPic)
      $('#authorPicMin').attr('src', imgPath + info.userPic)
      $('#name').text(info.firstName)
      $('#surname').text(info.lastName)
      $('#mailbox').text(info.userEamil)
      $('#phoneNum').text(info.userLogin)
      $('#jobTitle').text(info.position)
      $('#roleVal').text(info.roleName)
    }

    const pickButtons = ['cancel', 'sure']
    var rolePicker = new mui.PopPicker({
      buttons: pickButtons
    });

    mui('body').on('tap', '#role', function () {
      const me = this
      rolePicker.show(function (items) {
        $('#roleVal').text(items[0].text)
        update(items[0].value)
        // $(me).attr('data-val', items[0].value)
      });
    })


    function update(projectRoleId) {
      const params = {
        id: info.projectUserId,
        projectId: info.pid,
        projectRoleId: projectRoleId,
        userId: info.userId
      }
      $ajax('/projectuser/update', 'post', params, function (res) {
        mui.toast(res.msg)
      })
    }
    console.log('info', info)

    getRole()

    function getRole() {
      $ajax('/role/list?type=2&orgId=' + orgId, 'get', '', function (res) {
        console.log(res)
        if (res.code === 1) {
          const rolePickerList = []
          res.data.map(item => {
            const obj = {
              value: item.id,
              text: item.roleName
            }
            rolePickerList.push(obj)
          })
          rolePicker.setData(rolePickerList)
        }
      })
    }

    mui('body').on('tap', '.goBack', function () {
      mui.back()
    })

    mui('body').on('tap', '#sendMessage', function () {
      mui.openWindow({
        url: '/h5/zh/chat/chatDetail.html?staffId=' + info.userId,
        id: 'chatDetail'
      })
    })
  });
})(mui, document, jQuery);