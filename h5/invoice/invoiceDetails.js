(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const url = 'https://alieneye.s3.cn-northwest-1.amazonaws.com.cn/'
    const path = getUrlParam('url')
    distinguish(path)
    function distinguish (path) {
      $ajax('/projectinvoice/distinguish?url=' + url + path, 'get', '', (res) => {
        const resData = res.data
        $('#invoice-pic')[0].src = url + path
        $('#invoice-pic').attr('data-path', path)
        $('#invoiceDate').text(resData.invoiceDate)
        $('#invoiceCode').text(resData.invoiceCode)
        $('#invoiceNum').text(resData.invoiceNum)
        $('#verifiyCode').text()
        $('#invoiceAmount').text(resData.invoiceAmount)
        $('#invoiceTax').text(resData.invoiceTax)
        $('#amountExtax').text(resData.amountExtax)
        $('#draweeName').text(resData.draweeName)
        $('#draweeTaxno').text(resData.draweeTaxno)
        $('#draweeAddphone').text(resData.draweeAddphone)
        $('#draweeBankaccount').text(resData.draweeBankaccount)
        $('#sellerName').text(resData.sellerName)
        $('#sellerTax').text(resData.sellerTax)
        $('#sellerAddphone').text(resData.sellerAddphone)
        $('#sellerBankaccount').text(resData.sellerBankaccount)
        $('#category').attr('data-type', resData.type)
      })
    }

    const pickButtons = ['cancel', 'sure']
    var categoryPicker = new mui.PopPicker({
      buttons: pickButtons
    });

    mui('.invoice-details').on('tap', '#category', function () {
      const me = this
      categoryPicker.show(function (items) {
        $(me).text(items[0].text)
        $(me).attr('data-val', items[0].value)
      });
    })


    // const pid = 50
    categoryList()
    function categoryList () {
      $ajax('/category/list?type=3&&pid=' + 1, 'get', '', (res) => {
        console.log(res)
        const categoryPickerList = []
        res.data.map(item => {
          const obj = {
            value: item.id,
            text: item.name
          }
          categoryPickerList.push(obj)
        })
        categoryPicker.setData(categoryPickerList)
      })
    }

    mui('body').on('tap', '.submit', function () {
      if (!$('#category').attr('data-val')) {
        mui.toast('请选择发票类型')
        return false
      }
      const params = {
        amountExtax: $('#amountExtax').text(),
        checkCode: $('#verifiyCode').val(),
        // "createDate": "2019-12-19T11:11:14.193Z",
        createUserid: Number(localStorage.getItem('userId')),
        draweeAddphone: $('#draweeAddphone').text(),
        draweeBankaccount: $('#draweeBankaccount').text(),
        draweeName: $('#draweeName').text(),
        draweeTaxno: $('#draweeTaxno').text(),
        // "id": 0,
        invoiceAmount: Number($('#invoiceAmount').text()),
        invoiceCode: $('#invoiceCode').text(),
        invoiceDate: $('#invoiceDate').text(),
        invoiceNum: $('#invoiceNum').text(),
        invoiceTax: $('#invoiceTax').text(),
        invoiceType: Number($('#category').attr('data-val')),
        pic: $('#invoice-pic').attr('data-path'),
        projectId: Number(JSON.parse(localStorage.getItem('project')).id),
        // "remarks": "string",
        sellerAddphone: $('#sellerAddphone').text(),
        sellerBankaccount: $('#sellerBankaccount').text(),
        sellerName: $('#sellerName').text(),
        sellerTax: $('#sellerTax').text(),
        type: Number($('#category').attr('data-type'))
      }
      $ajax('/projectinvoice/save', 'post', params, (res) => {
        mui.toast(res.msg)
        if (res.code === 1) {
          back()
        }
      })
    })

    mui('body').on('tap', '.back, .cancel', () => {
      // mui.back()
      back()
    })

  });
})(mui, document, jQuery);