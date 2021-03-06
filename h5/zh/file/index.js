(function ($$, doc, $) {
  let page = 1
  const size = 15
  let createUserid = localStorage.getItem('userId')
  let pid = JSON.parse(localStorage.getItem('project')).id
  // alert('v2')
  // let createUserid = 62
  // let pid = 10047
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
  const parentId = getUrlParam('parentId') || 0
  if (parentId) {
    $('#back').show()
    $('#sidebar').hide()
  }

  function pulldownRefresh() {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    $('#fileList').html('')
    loadData()
  }

  function pullupRefresh() {
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

  function loadData() {
    $ajax('/projectfolder/list?userId=' + createUserid + '&parentId=' + parentId + '&projectId=' + pid + '&page=' + page + '&size=' + size, 'get', '', (res) => {
      console.log(res)
      $('#pullrefresh').attr('data-page', page)
      $('#pullrefresh').attr('data-total', res.data.total)
      let temp = ''
      const resData = res.data.rows
      localStorage.setItem('fileList', JSON.stringify(resData))
      resData.map((item, index) => {
        console.log(item)
        let filePic = '/h5/images/file_icon.jpg'
        let fileType = 'file'
        // let path = item.pic
        if (item.type === 1) {
          const imgSuffix = ['.jpg', '.png', '.jpeg']
          if (item.name.substr(-4) === '.pdf') {
            filePic = '/h5/images/file_pdf.jpg'
            fileType = 'pdf'
          } else if (item.pic && (imgSuffix.indexOf(item.pic.substr(-4)) !== -1 || item.pic.substr(-5) == '.jpeg')) {
            fileType = 'img'
            filePic = imgPath + item.pic
          } else {
            fileType = 'office'
            filePic = '/h5/images/file-word.png'
          }
        }
        const createDate = datetime2Str(new Date(item.createDate))
        // const createDate = iosTimeFormtter(item.createDate)
        temp += `<li class="flex border-b-grey align-center file-item">
          <div class="mr-15"><input type="checkbox" data-index="${index}"/></div>
          <div class="flex align-center file-content" data-id="${item.id}" data-fileType='${fileType}' data-path="${item.pic}">
            <img src="${filePic}" class="mr-15"/>
            <div>
              <p class="ft-12 text-333 line-height-15">${item.name}</p>
              <p class="ft-12 text-default line-height-15">${createDate}</p>
            </div>
          </div>
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
    activeSidebar('file')
    mui('body').on('tap', '#back', function () {
      mui.back()
    })
    mui('.page-title').on('tap', '#addFileShow', function () {
      $('.add-file-popup').show()
    })
    mui('body').on('tap', '.opacity-bg', function () {
      $('.popup').hide()
    })
    mui('.popup').on('change', '#addInvoice', function () {
      const file = this.files[0]
      const formData = new FormData()
      formData.append('file', file)
      console.log(formData)
      uploadImg(formData)
    })

    mui('.popup').on('tap', '#createFile', function () {
      console.log('this', this)
      $('.add-file-popup').hide()
      $('.create-file-popup').show()
      $('#fileName').val('')
      $('.create-file-popup').attr('data-edit', '')
    })

    mui('.popup').on('tap', '#editFile', function () {
      const idx = $("input:checked")[0].getAttribute('data-index')
      const fileList = JSON.parse(localStorage.getItem('fileList'))
      $('.add-file-popup').hide()
      if (fileList[idx].type === 2) {
        $('.create-file-popup').show()
        $('#fileName').val(fileList[idx].name)
        $('.create-file-popup').attr('data-edit', idx)
        return false
      }
      mui.toast('请选择文件夹修改')
      // $('input').attr('checked', false)
    })


    mui('.popup').on('tap', '#delFile', function () {
      console.log('------')
      const checkEl = $("input:checked")
      if (!checkEl.length) {
        mui.toast('请选择需要删除的数据')
        $('.popup').hide()
        return false
      }
      const fileListStr = localStorage.getItem('fileList')
      const fileList = JSON.parse(fileListStr)
      const delFileList = []
      checkEl.map((idx, el) => {
        const dataIdx = el.getAttribute('data-index')
        fileList[dataIdx].status = 1
        delFileList.push(fileList[dataIdx])
      })
      console.log('delFileList', delFileList)
      $ajax('/projectfolder/delete', 'post', delFileList, function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          page = 1
          $('#fileList').html('')
          loadData()
          $('.popup').hide()
        }
      })
    })

    mui('#fileList').on('tap', '.file-content', function () {
      console.log('---------filelist')
      const fileType = this.getAttribute('data-fileType')
      const path = this.getAttribute('data-path')
      console.log('path', path)
      if (fileType === 'file') {
        const id = this.getAttribute('data-id')
        mui.openWindow({
          url: '/h5/zh/file/index.html?parentId=' + id,
          id: 'fileChild'
        })
      } else if (fileType === 'office') {
        mui.openWindow({
          url: '/h5/zh/file/detailFile.html?path=' + path,
          id: 'detailFile'
        })
        // loadingShow()
        // location.href = `https://view.officeapps.live.com/op/view.aspx?src=${imgPath}${path}`
      } else if (fileType === 'img') {
        mui.openWindow({
          url: `/h5/zh/file/detail.html?path=${path}&type=${fileType}`,
          id: 'fileChild'
        })
      } else if (fileType === 'pdf') {
        // window.open(`${imgPath}${path}`)
        location.href = `${imgPath}${path}`
      }
    })

    mui('.create-file-popup').on('tap', '#determine', function () {
      const idx = $('.create-file-popup').attr('data-edit')
      let params = ''
      if (idx) {
        const file = JSON.parse(localStorage.getItem('fileList'))[idx]
        params = {
          id: file.id,
          name: $('#fileName').val()
        }
        updateFile(params)
        return false
      }
      params = {
        createUserid: createUserid,
        name: $('#fileName').val(),
        projectId: pid,
        parentId: parentId,
        type: 2
      }
      saveFile(params)
    })

    mui('.popup').on('tap', '#cancel', function () {
      $('.popup').hide()
    })

    mui('.popup').on('change', '#uploadFile', function () {
      loadingShow()
      const file = this.files[0]
      const formData = new FormData()
      formData.append('file', file)
      console.log(formData)
      // uploadImg(formData)
      const api = '/upload/fileuploadaws'
      // if (file.type.indexOf('image') === -1) {
      //   api = '/upload/fileuploadpdf'
      // }
      $upload(api, 'post', formData, (res) => {
        mui.toast(res.msg)
        loadingHide()
        if (res.code === 1) {
          $('#fileList').html('')
          $('.add-file-popup').hide()
          const params = {
            createUserid: createUserid,
            name: file.name,
            projectId: pid,
            parentId: parentId,
            pic: res.data.url,
            type: 1
          }
          saveFile(params)
        }
      })
    })

    // mui('body').on('change', '#searchInput', function() {

    // })

    loadData()


    function saveFile(params) {
      $ajax('/projectfolder/save', 'post', params, (res) => {
        if (res.code === 1) {
          $('#fileList').html('')
          loadData()
          $('.create-file-popup').hide()
          $('.create-file-popup').attr('data-edit', '')
        }
      })
    }

    function updateFile(params) {
      $ajax('/projectfolder/update', 'post', params, (res) => {
        if (res.code === 1) {
          $('#fileList').html('')
          loadData()
          $('.create-file-popup').hide()
          $('.create-file-popup').attr('data-edit', '')
        }
      })
    }


    // function uploadImg () {
    //   $upload('/upload/fileuploadaws', 'post', formData, (res) => {
    //     mui.toast(res.msg)
    //     if (res.code === 1) {
    //       $('#fileList').html('')
    //       loadData()
    //       $('.add-file-popup').hide()
    //     }
    //   })
    // }
    mui('.popup').on('tap', '#operation', function () { 
      $('.popup').hide()
      $('#optionsBox').show()
    })
    mui('#optionsBox').on('tap', '#removeCompletely', function () { 
      // 删除
      const checkEl = $("input:checked")
      if (!checkEl.length) {
        mui.toast('请选择需要删除的数据')
        $('.popup').hide()
        return false
      }
      const fileListStr = localStorage.getItem('fileList')
      const fileList = JSON.parse(fileListStr)
      const delFileList = []
      checkEl.map((idx, el) => {
        const dataIdx = el.getAttribute('data-index')
        fileList[dataIdx].status = 1
        delFileList.push(fileList[dataIdx])
      })
      console.log('delFileList', delFileList)
      $ajax('/projectfolder/delete', 'post', delFileList, function (res) {
        mui.toast(res.msg)
        if (res.code === 1) {
          page = 1
          $('#fileList').html('')
          loadData()
          $('.popup').hide()
        }
      })
    })
    mui('#optionsBox').on('tap', '#copyFolder', function () { 
      // 复制
      const checkEl = $("input:checked")
      if (!checkEl.length) {
        mui.toast('请选择需要复制的文件')
        $('.popup').hide()
        return false
      }
      if (checkEl.length > 1) { 
        mui.toast('只能选择一条复制')
        $('.popup').hide()
        return false
      }
      const idx = $("input:checked")[0].getAttribute('data-index')
      const fileList = JSON.parse(localStorage.getItem('fileList'))
      const data = fileList[idx]
      params = {
        createUserid: createUserid,
        name: data.name,
        projectId: pid,
        parentId: parentId
      }
      if (data.type === 2) {
        params.type = 2
      } else { 
        params.type = 1
        params.pic = data.url
      }
      saveFile(params)
      $('.popup').hide()
    })
    mui('#optionsBox').on('tap', '#modificationName', function () { 
      // 修改名称
      const checkEl = $("input:checked")
      if (!checkEl.length) {
        mui.toast('请选择需要修改的数据')
        $('.popup').hide()
        return false
      }
      if (checkEl.length > 1) { 
        mui.toast('只能选择一条修改')
        $('.popup').hide()
        return false
      }
      const idx = $("input:checked")[0].getAttribute('data-index')
      const fileList = JSON.parse(localStorage.getItem('fileList'))
      $('.popup').hide()
      $('.create-file-popup').show()
      $('#fileName').val(fileList[idx].name)
      $('.create-file-popup').attr('data-edit', idx)
    })
  });
})(mui, document, jQuery);