(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const path = imgPath + getUrlParam('path')
    let temp = `<img src="${path}" width="100%">`
    // if (getUrlParam('type') === 'img') {
    //   temp = `<img src="${path}" width="100%">`
    // } else {
    //   alert(path)
    //   temp = `<iframe src="${path}" width="400px" height="500px" frameborder="0"></iframe>`
    // }
    $('#detailBox').html(temp)
    mui('body').on('tap', '.back', function () {
      mui.back()
    })
  })
})(mui, document, jQuery);