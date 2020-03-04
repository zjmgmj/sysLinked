(function ($$, doc, $) {
  let page = 1
  const size = 15
  // let pid = JSON.parse(localStorage.getItem('project')).id
  const id = getUrlParam('id')
  const pid = 10052
  let playerUrl = []
  let accessToken = ''
  mui('.page-title').on('tap', '#addFileShow', function () {
    $('.add-file-popup').show()
  })
  mui('.popup').on('tap', '#addDevice', function () {
    $('.add-file-popup').hide()
    $('.create-file-popup').show()
    $('#accessToken').val('')
    $('#url').val('')
    $('#equipmentName').val('')
    $('#serialNumber').val('')
    $('#channelNumber').val('')
    // $('.create-file-popup').attr('data-edit', '')
  })
  function pulldownRefresh() {
    //  下拉刷新具体业务实现
    console.log('pulldownRefresh')
    page = 1
    playerUrl = []
    // $('#fileList').html('')
    loadData()
  }
  // const itemSize = {
  //   width: 0,
  //   height: 0
  // }
  function getItemSize() {
    // const width = window.screen.availWidth/2 - 20
    // const height = width / (600 / 400)
    const width = window.screen.availWidth
    const height = width / (600 / 400)
    // $('#deviceList').attr('style', `width: ${width}px; height: ${height}px`)
    return {width, height}
  }
  const itemSize = getItemSize()
  console.log('itemSize', itemSize)
  const players = {}
  
  function loadData() {
    $ajax('/projectdevice/list?projectId=' + pid + '&page=' + page + '&size=' + size, 'get', '', (res) => {
      // let temp = ''
      const resData = res.data.rows
      // debugger
      // resData.push(...res.data.rows,...res.data.rows)
      resData.map((item, index) => {
        console.log(item)
        // temp += `<li class="device-item" style="width: ${itemSize.width}px; height: ${itemSize.height}px">
        //   <div class="select-device">
        //     <div class="icon iconfont f-grey ft-20 iconicon-test7"></div>
        //     <div class="ft-18 mt-05">Select device</div>
        //   </div>
        //   <div class="video" id="player_${index}"></div>
        // </li>`
        // players[`player_${index}`] = {
        //   row: item,
        //   fun: ''
        // }
        playerUrl.push(item.ipaddress)
      })
      accessToken = resData[0].username
      initPlay()
      mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    })
  }
  
  function handleError(e){
    console.log('捕获到错误',e)
  }
  function handleSuccess(){
    console.log("播放成功回调函数，此处可执行播放成功后续动作");
  }
  
  function initPlay () { 
    new EZUIKit.EZUIPlayer({
      id: 'deviceList',
      autoplay: true,
      url: '',
      url: playerUrl.toString(),
      accessToken: accessToken,
      decoderPath: '/h5/js/EZUIKit/',
      width: itemSize.width,
      height: itemSize.height,
      handleError: handleError,
      handleSuccess: handleSuccess,
      splitBasis: 1
    });
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
    $("#seeAllDevices").click(function () {
      console.log('sss')
      player.enableZoom();
    })
    $("#closeZoom").click(function () {
      player.closeZoom();
    })
    $("#myPlayer").click(function () {
      function handleError(e){
        console.log('handleError',e)
      }
      function handleSuccess(){
        console.log('handleSuccess')
      }
      myPlayer.play({
        handleError: handleError,
      });
    })
    // function log(str){
    //   var div = document.createElement('DIV');
    //   div.innerHTML = (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') + JSON.stringify(str);
    //   document.body.appendChild(div);
    // }
  })
})(mui, document, jQuery);