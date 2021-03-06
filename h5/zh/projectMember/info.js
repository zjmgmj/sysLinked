(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    // window.addEventListener('hashchange', function() {
    //   //为当前导航页附加一个tag
    //   this.history.replaceState('hasHash', '', '');
    // }, false);
    const orgId = localStorage.getItem('orgDefault')
    const info = JSON.parse(localStorage.getItem('projectuserDetail'))
    const from = getUrlParam('from')
    // const url = 'https://test-for-syslinked1.s3.cn-north-1.amazonaws.com.cn/'
    if (info.roleName === '拥有者' || info.orgRoleName === '拥有者') {
      $('#authority').hide()
      $('#sendMessage').hide()
     }
    function initData () {
      const authorPic = info.userPic ? imgPath + info.userPic : '/h5/images/avatar.png'
      $('#authorPicMin, #authorPicMax').attr('style', `background: url(${authorPic});
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;`)
      $('#name').text(info.firstName)
      $('#surname').text(info.lastName)
      $('#mailbox').text(info.userEamil)
      $('#phoneNum').text(info.userLogin)
      $('#jobTitle').text(info.position)
      $('#roleVal').text(info.roleName || info.orgRoleName)
    }

    const pickButtons =  ['取消', '确认']
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
      let params = {}
      let url =''
      if (from === 'organization') {
        params = {
          id: info.orgUserId,
          orgRoleId: projectRoleId
        }
        url= '/orguser/update'
      } else { 
        params = {
          id: info.projectUserId,
          projectId: info.pid,
          projectRoleId: projectRoleId,
          userId: info.userId
        }
        url= '/projectuser/update'
      }
      $ajax(url, 'post', params, function (res) {
        mui.toast(res.msg)
      })
    }
    getRole()

    function getRole () {
      const type = from === 'organization' ? 1 : 2
      $ajax('/role/list?type='+type+'&orgId=' + orgId, 'get', '', function (res) {
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
          initData()
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