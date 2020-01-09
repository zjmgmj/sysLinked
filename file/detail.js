(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const path = 'https://test-for-syslinked1.s3.cn-north-1.amazonaws.com.cn/' + getUrlParam('path')
    const temp = `<img src="${path}" width="100%">`
    $('#detailBox').html(temp)
    mui('body').on('tap', '.back', function () {
      mui.back()
    })
  })
})(mui, document, jQuery);