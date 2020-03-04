(function ($$, doc, $) {
  const id = getUrlParam('id')
  let player = ''
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
  
  function loadData() {
    $ajax('/projectdevice/detail?id=' + id, 'get', '', (res) => { 
      const resData = res.data
      player = new EZUIKit.EZUIPlayer({
        id: 'deviceList',
        autoplay: true,
        url: resData.ipaddress,
        accessToken: resData.username,
        decoderPath: '/h5/js/EZUIKit/',
        width: itemSize.width,
        height: itemSize.height,
        handleError: handleError,
        handleSuccess: handleSuccess,
        splitBasis: 1
      });
    })
  }
  
  function handleError(e){
    console.log('捕获到错误',e)
  }
  function handleSuccess(){
    console.log("播放成功回调函数，此处可执行播放成功后续动作");
  }
  
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
    mui('body').on('tap', '#back', function () { 
      mui.back()
    })
  })
})(mui, document, jQuery);