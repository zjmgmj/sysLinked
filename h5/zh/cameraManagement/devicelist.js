(function ($$, doc, $) {
  let page = 1
  const size = 20
  const pid = JSON.parse(localStorage.getItem('project')).id
  console.log(pid)
  // const pid = 10052
  function pulldownRefresh() {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    playerUrl = []
    $('#fileList').html('')
    loadData()
  }
  
  function loadData() {
    $ajax('/projectdevice/list?projectId=' + pid + '&page=' + page + '&size=' + size, 'get', '', (res) => {
      let temp = ''
      const resData = res.data.rows
      resData.map((item, index) => {
        // temp += `<li class="flex border-b-grey flex-between align-center file-item" data-id="${item.id}">
        //   <div class="col flex align-center file-content">
        //     <img src="/h5/images/vedios.png" class="mr-15"/>
        //     <p class="ft-12 text-333 line-height-15">${item.deviceName}</p>
        //   </div>
        //   <div class="flex flex-end">
        //     <div class="edit icon iconfont iconedit" data-id="${item.id}"></div>
        //     <div class="ml-05 del icon iconfont iconicon-test9" data-id="${item.id}"></div>
        //   </div>
        // </li>`
        temp += `<li class="flex border-b-grey flex-between align-center file-item" data-id="${item.id}">
          <div class="col flex align-center file-content">
            <img src="/h5/images/vedios.png" class="mr-15"/>
            <p class="ft-12 text-333 line-height-15">${item.deviceName}</p>
          </div>
        </li>`
      })
      if (!temp) { 
        temp = `<div class="mt-10 text-center">No Data</div>`
      }
      $('#fileList').append(temp)
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    })
  }
  
  mui.init({
    pullRefresh: {
      container: '#pullrefresh',
      down: {
        contentdown: "Pull down to refresh",
        contentover: "Refresh immediately",
        contentrefresh: "loading",
        callback: pulldownRefresh
      }
    }
  });
  mui.ready(function () { 
    // 日志
    loadData()
    mui('body').on('tap', '#addDevice', function () {
      $('.device-form').attr('style', '')
      $('.create-file-popup').show()
      $('#accessToken').val('')
      $('#url').val('')
      $('#equipmentName').val('')
      $('#serialNumber').val('')
      $('#channelNumber').val('')
      // $('.create-file-popup').attr('data-edit', '')
    })
    mui('.create-file-popup').on('tap', '#determine', function () {
      console.log('----')
      let temporary = localStorage.getItem('temporary')
      if (temporary) {
        temporary = JSON.parse(temporary)
      }
      let vail = true
      if ($('#accessToken').val().trim() == '') { 
        $($('#accessToken').parent()).attr('style', 'border-bottom:1px solid #fd0303;')
        vail = false
      }
      if ($('#url').val().trim() == '') { 
        $($('#url').parent()).attr('style', 'border-bottom:1px solid #fd0303;')
        vail = false
      }
      if ($('#equipmentName').val().trim() == '') { 
        $($('#equipmentName').parent()).attr('style', 'border-bottom:1px solid #fd0303;')
        vail = false
      }
      if ($('#serialNumber').val().trim() == '') { 
        $($('#serialNumber').parent()).attr('style', 'border-bottom:1px solid #fd0303;')
        vail = false
      }
      if ($('#channelNumber').val().trim() == '') { 
        $($('#channelNumber').parent()).attr('style', 'border-bottom:1px solid #fd0303;')
        vail = false
      }
      if (vail) { 
        let params = {
          username: $('#accessToken').val().trim(),
          ipaddress: $('#url').val().trim(),
          deviceName: $('#equipmentName').val().trim(),
          deviceNum: $('#serialNumber').val().trim(),
          channelsStart: $('#channelNumber').val().trim(),
          createUserid: Number(localStorage.getItem('userId')),
          projectId: pid
        }
        let url = '/projectdevice/save'
        if (temporary.id) {
          params = Object.assign(temporary, params)
          url = '/projectdevice/update'
         }
        $ajax(url, 'post', params, (res) => {
          mui.toast(res.msg)
          if (res.code === 1) { 
            pulldownRefresh()
            $('.create-file-popup').hide()
            localStorage.setItem('temporary', '')
          }
        })
      }
    })
    mui('.create-file-popup').on('tap', '#cancel', function () {
      $('.create-file-popup').hide()
      localStorage.setItem('temporary', '')
    })
    mui('#fileList').on('tap', '.edit', function () {
      const id = this.getAttribute('data-id')
      $ajax('/projectdevice/detail?id=' + id, 'get', '', (res) => { 
        const resData = res.data
        localStorage.setItem('temporary', JSON.stringify(resData))
        $('.device-form').attr('style', '')
        $('.create-file-popup').show()
        $('#accessToken').val(resData.username)
        $('#url').val(resData.ipaddress)
        $('#equipmentName').val(resData.deviceName)
        $('#serialNumber').val(resData.deviceNum)
        $('#channelNumber').val(resData.channelsStart)
      })
      return false
    })
    mui('#fileList').on('tap', '.del', function () {
      const id = this.getAttribute('data-id')
      $ajax('/projectdevice/detail?id=' + id, 'get', '', (res) => { 
        const resData = res.data
        $ajax('/projectdevice/delete', 'post', [resData], (res) => { 
          mui.toast(res.msg)
          if (res.code === 1) {
            pulldownRefresh()
           }
        })
      })
      return false
    })
    mui('#fileList').on('tap', '.file-item', function () { 
      const id = this.getAttribute('data-id')
      mui.openWindow({
        url: '/h5/zh/cameraManagement?id=' + id,
        id: 'cameraManagement'
      })
      return false
    })
  })
})(mui, document, jQuery);