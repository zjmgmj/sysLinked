(function ($$, doc, $) {
  let maxWidth = 0
  let userId = null
  let orgId = null

  function joinorglistAjax(id) {
    localStorage.setItem('userId', id)
    $ajax('/org/joinorglist?userId=' + id, 'get', '', function (res) {
      if (res.data.length > 0) {
        const defaultOrg = res.data.find(item => {
          return item.isdefault === 1
        })
        orgId = defaultOrg ? defaultOrg['id'] : res.data[0].id
        localStorage.setItem('orgDefault', JSON.stringify(orgId))
        localStorage.setItem('orgJoinorg', JSON.stringify(res.data))
        load()
        window.setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler('setOrgId', JSON.stringify({
            defaultOrgId: orgId
          }))
        })
      } else {
        // document.getElementById('content').innerHTML = contentTemp
        $('#content').html(`<div class="text-center pt-10">No data</div>`)
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
      }
    })
  }

  function getuser() {
    $ajax('/user/getuser?userId=' + userId, 'get', '', function (res) {
      // console.log(res)
      const resData = res.data
      localStorage.setItem('userInfo', JSON.stringify(resData))
    })
  }

  function pulldownRefresh() {
    // userId = 39
    // orgId = 32
    // joinorglistAjax(userId)
    // getuser(userId)

    getJoinorglist()
  }

  function load() {
    const orgId = localStorage.getItem('orgDefault')
    const userId = localStorage.getItem('userId')
    $ajax('/project/list?page=1&size=50&orgId=' + orgId + '&userId=' + userId, 'get', null, (res) => {
      // console.log('res', res.data.rows)
      const resData = res.data.rows
      let starredProjectsTemp = ''
      let startupProjectTemp = ''
      let closeProjectTemp = ''
      let i = 0
      let starredCount = 0
      let startupCount = 0
      let closeCount = 0
      // if (resData.length) { }
      resData.map((item) => {
        const temp = `<li class="store-txt" data-status="${item.status}" data-id="${item.id}" data-orgId="${item.orgId}">
          <div class="store-left flex flex-between align-center">
            <img class="store-pic" src="${item.pic !== 'null' && item.pic !== '' ? imgPath + item.pic : '/h5/images/nike.png'}" alt="sysLinked" />            
            <p class="col">
              <span>${item.id}</span>
              <span>${item.name}</span>
            </p>
            <i class="icon iconfont iconicon-test11 setting"></i>
            <i class="icon iconfont ${item.status === 2 ? 'iconicon-test6' : 'iconicon-test5'} Pentagram"></i>
          </div>
          <div class="delete">
            <i class="icon iconfont text-white ft-20">&#xe63b;</i>
          </div>
        </li>`
        // log(temp)
        switch (item.status) {
          case 1:
            startupProjectTemp += temp
            startupCount++
            break
          case 2:
            starredProjectsTemp += temp
            starredCount++
            break
          case 3:
            closeProjectTemp += temp
            closeCount++
            break
        }
      })
      const contentTemp = `<h1>My Starred Projects · <span id="starredCount">${starredCount}</span></h1>
      <ul class="store-list" id="starredProjects">${starredProjectsTemp}</ul>
      <h1>Startup Project · <span id="startupCount">${startupCount}</span></h1>
      <ul class="store-list" id="startupProject">${startupProjectTemp}</ul>
      <h1>Close Project · <span id="closeCount">${closeCount}</span></h1>
      <ul class="store-list close-list" id="closeProject">${closeProjectTemp}</ul>`
      localStorage.setItem('projectList', JSON.stringify(resData))
      // $('#starredCount').text(starredCount)
      // $('#startupCount').text(startupCount)
      // $('#closeCount').text(closeCount)
      // document.getElementById('starredProjects').innerHTML = starredProjectsTemp
      // document.getElementById('startupProject').innerHTML = startupProjectTemp
      // document.getElementById('closeProject').innerHTML = closeProjectTemp
      // document.getElementById('content').innerHTML = contentTemp
      $('#content').html(contentTemp)
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh()
      if ($('.store-txt').length > 0) maxWidth = $('.store-txt')[0].clientWidth
    })
  }


  function getJoinorglist() {
    // joinorglistAjax('39')
    window.setupWebViewJavascriptBridge(bridge => {
      bridge.callHandler('getUserId', '', (result) => {
        const resData = JSON.parse(result)
        userId = resData.userId
        // log('参数', result)
        // log('userId', userId)
        joinorglistAjax(resData.userId)
        getuser(resData.userId)
        window.setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler('hasGetUserId', JSON.stringify({
            flag: 1
          }), () => {
            // log('hasGetUserId')
          })
        })
      })
      // if (userId) {
      //   bridge.callHandler('hasGetUserId', { flag: 1 })
      // }
    })
  }
  mui.init(muiInit('#pullrefresh', pulldownRefresh));
  mui.ready(function () {

    // userId = 34
    // joinorglistAjax(userId)
    // getuser(userId)

    const minWidth = window.innerWidth * 0.6




    mui('#content').on('drag', '.store-left', (event) => {
      const newWidth = event.path[1].clientWidth + event.detail.deltaX
      if ($(event.path[1]).attr('class').indexOf('store-left') !== -1) {
        event.path[1].style.width = (newWidth < minWidth ? minWidth : newWidth > maxWidth ? maxWidth : newWidth) + 'px'
      }
    })

    // 删除
    mui('#content').on('tap', '.delete', function (e) {
      const id = $(this).parents('.store-txt').attr('data-id')
      // const id = 1
      const node = $(this).parents('.store-txt')

      const params = {
        createUserid: localStorage.getItem('userId'),
        id: node.attr('data-id'),
        orgId: node.attr('data-orgId'),
        status: '3'
      }
      $ajax('/project/update', 'post', params, (res) => {
        mui.toast(res.msg)
        if (res.code === 1) {
          load()
        }
      })
    })


    // 设置
    mui('#content').on('tap', '.setting', function () {
      // console.log(this)
      const id = $(this).parents('.store-txt').attr('data-id')
      mui.openWindow({
        url: '/h5/projectMember/createProject.html?id=' + id,
        id: 'project'
      })
      return false
    })

    // 星
    mui('#content').on('tap', '.Pentagram', function () {
      const node = $(this).parents('.store-txt')
      const params = {
        createUserid: userId,
        id: node.attr('data-id'),
        orgId: node.attr('data-orgId'),
        status: node.attr('data-status') === '2' ? 1 : 2
      }
      $ajax('/project/update', 'post', params, (res) => {
        if (res.code === 1) {
          if ($(this).attr('class').indexOf('iconicon-test6') !== -1) {
            $(this).attr('class', 'icon iconfont iconicon-test5 Pentagram')
          } else {
            $(this).attr('class', 'icon iconfont iconicon-test6 Pentagram')
          }
          load()
        }
        mui.toast(res.msg)
      })
      return false
    })

    mui('#content').on('tap', '.store-left', function () {
      // 选择项目
      const id = $(this).parents('.store-txt').attr('data-id')
      const getProjectList = JSON.parse(localStorage.getItem('projectList'))
      const projectList = getProjectList.find((item) => {
        return item.id = Number(id)
      })
      localStorage.setItem('project', JSON.stringify(projectList))
      window.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler('projectClick', JSON.stringify(projectList))
      })
    })

    mui('.edit-group').on('tap', '.create-project', function () {
      // window.setupWebViewJavascriptBridge(bridge => {
      //   bridge.callHandler('changeData', JSON.stringify({ defaultOrgId: defaultOrg.id }), (result) => {
      //     alert(result)
      //   })
      // })      
      mui.openWindow({
        url: '/h5/projectMember/createProject.html',
        id: 'project'
      })
    })
  });

})(mui, document, jQuery);