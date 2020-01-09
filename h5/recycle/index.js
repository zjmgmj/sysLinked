(function ($$, doc, $) {
  const pid = JSON.parse(localStorage.getItem('project')).id
  let page = 1
  const size = 15
  const createUserid = Number(localStorage.getItem('userId'))
  // window.setupWebViewJavascriptBridge(bridge => {
  //   bridge.callHandler('getUserId', '', (result) => {
  //     const resData = JSON.parse(result)
  //     createUserid = resData.userId
  //     // getJoinorglist()
  //     // loadData()
  //   })
  // })
  // window.setupWebViewJavascriptBridge(bridge => {
  //   bridge.callHandler('getProjectId', '', (result) => {
  //     const resData = JSON.parse(result)
  //     pid = resData.projectId
  //     // getJoinorglist()
  //     // loadData()
  //   })
  // })
  function pulldownRefresh () {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    // localStorage.setItem('recoverFileList')
    localStorage.removeItem('recoverFileList')
    $('#fileList').html('')
    loadData()
  }
  function pullupRefresh () {
    // 上拉加载具体业务实现
    console.log('pullupRefresh')
    const total = $('#pullrefresh').attr('data-total')
    if (total == $('#fileList .file-item').length) {
      mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
      return false
    }
    page = Number($('#pullrefresh').attr('data-page')) + 1
    loadData()
  }
  function loadData () {
    $ajax('/projectrecycle/list?projectId=' + pid + '&page=' + page + '&size=' + size, 'get', '', (res) => {
      console.log(res)
      $('#pullrefresh').attr('data-page', page)
      $('#pullrefresh').attr('data-total', res.data.total)
      let temp = ''
      const resData = res.data.rows
      const recoverFileListStorage = JSON.parse(localStorage.getItem('recoverFileList')) || []
      const recoverFileList = recoverFileListStorage.concat(resData)
      localStorage.setItem('recoverFileList', JSON.stringify(recoverFileList))
      resData.map((item, index) => {
        console.log(item)
        let filePic = '/h5/images/file_icon.jpg'
        if (item.type === 1) {
          const imgSuffix = ['.jpg', '.png']
          filePic = imgPath + item.pic
          if (imgSuffix.indexOf(item.pic.substr(-4)) === -1) {
            filePic = '/h5/images/file_pdf.jpg'
          }
        }
        // const createDate = datetime2Str(new Date(item.createDate))
        const createDate = iosTimeFormtter(item.messagesDate)
        temp += `<li class="flex flex-between border-b-grey file-item">
        <div class="flex align-center">
          <div class="mr-15"><input type="checkbox" data-id="${item.id}" data-index="${index}"/></div>
          <img src="${filePic}" class="mr-15"/>
          <div class="pt-10">
            <p class="ft-12 text-333 line-height-15">${item.name}</p>
            <p class="ft-12 text-default line-height-15">${createDate}</p>
          </div>
          </div>
          <i class="icon iconfont text-default ft-16 iconcaozuo"></i>
        </li>`
      })
      $('#fileList').append(temp)
      if (page === 1) {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
      }
    })
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
    activeSidebar('recycleBin')
    mui('#pullrefresh').on('tap', '.file-item', function () {
      const checked = $(this).find('input').attr('checked')
      $(this).find('input').attr('checked', !checked)
      return false
    })

    mui('#pullrefresh').on('tap', '.iconcaozuo', function () {
      $('#optionsBox').show()
      const fileItem = $(this).parents('.file-item')
      fileItem.find('input').attr('checked', true)
      mui('.popup').on('tap', '#recoverFiles', function () {
        console.log('...', fileItem)
        // recoveryFile()
      })
      return false
    })
    mui('body').on('tap', '.iconcaozuo', function () {
      $('#optionsBox').show()
      return false
    })
    mui('body').on('tap', '.opacity-bg', function () {
      $('.popup').hide()
    })

    mui('.popup').on('tap', '#removeCompletely', function () {
      const checkEl = $("input:checked")
      if (!checkEl.length) {
        mui.toast('请选择需要删除的数据')
        $('.popup').hide()
        return false
      }
      const recoverFileList = []
      checkEl.map((idx, el) => {
        const id = el.getAttribute('data-id')
        recoverFileList.push(Number(id))
      })
      deleteFile(recoverFileList)
    })
    mui('.popup').on('tap', '#recoverFiles', function () {
      // const id = $("input:checked")[0].getAttribute('data-id')      
      const checkEl = $("input:checked")
      if (!checkEl.length) {
        mui.toast('请选择需要恢复的数据')
        $('.popup').hide()
        return false
      }
      const fileListStr = localStorage.getItem('recoverFileList')
      const fileList = JSON.parse(fileListStr)
      const recoverFileList = []
      checkEl.map((idx, el) => {
        const dataIdx = el.getAttribute('data-index')
        const id = el.getAttribute('data-id')
        const obj = {
          id: Number(id),
          projectId: pid,
          userId: createUserid
        }
        recoverFileList.push(obj)
      })
      recoveryFile(recoverFileList)
    })

    localStorage.removeItem('recoverFileList')
    loadData()

    function deleteFile (params) {
      $ajax('/projectrecycle/deleteall', 'post', params, function (res) {
        if (res.code === 1) {
          page = 1
          $('#fileList').html('')
          loadData()
          $('.popup').hide()
        }
        mui.toast(res.msg)
      })
    }

    function recoveryFile (params) {
      $ajax('/projectrecycle/recoveryall', 'post`', params, function (res) {
        console.log(res)
        if (res.code === 1) {
          page = 1
          localStorage.removeItem('recoverFileList')
          $('#fileList').html('')
          loadData()
          $('.popup').hide()
        }
        mui.toast(res.msg)
      })
    }
  });
})(mui, document, jQuery);