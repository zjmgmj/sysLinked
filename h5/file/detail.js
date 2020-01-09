(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const path = imgPath + getUrlParam('path')
    const temp = `<img src="${path}" width="100%">`
    $('#detailBox').html(temp)
    mui('body').on('tap', '.back', function () {
      mui.back()
    })
  })
})(mui, document, jQuery);