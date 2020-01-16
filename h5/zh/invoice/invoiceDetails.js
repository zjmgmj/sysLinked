(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const url = 'https://alieneye.s3.cn-northwest-1.amazonaws.com.cn/'
    const path = getUrlParam('url')
    const id = getUrlParam('id')
    const categoryPickerList = []
    categoryList()

    function invoiceDetail () {
      loadingShow()
      $ajax('/projectinvoice/detail?id=' + id, 'get', '', function (res) {
        console.log(res)
        loadingHide()
        if (res.code === 1) {
          const resData = res.data
          $('#invoice-pic')[0].src = url + resData.pic
          $('#invoice-pic').attr('data-path', resData.pic)
          $('#invoiceDate').text(resData.invoiceDate)
          $('#invoiceCode').text(resData.invoiceCode)
          $('#invoiceNum').text(resData.invoiceNum)
          $('#verifiyCode').text(resData.checkCode)
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
          $('#category').attr('data-val', resData.invoiceType)
          const invoiceType = categoryPickerList.find((item) => {
            return item.value === resData.invoiceType
          })
          if (invoiceType) {
            $('#category').text(invoiceType.text)
          }
          // $(me).attr('data-val', items[0].value)
        }
      })
    }


    function distinguish (path) {
      loadingShow()
      $ajax('/projectinvoice/distinguish?url=' + url + path, 'get', '', (res) => {
        if (res.code === 1) {
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
          $('#category').attr('data-val', resData.invoiceType)
        } else {
          mui.toast(res.msg)
        }
        loadingHide()
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
    function categoryList () {
      $ajax('/category/list?type=3&&pid=' + 1, 'get', '', (res) => {

        if (res.code === 1) {
          res.data.map(item => {
            const obj = {
              value: item.id,
              text: item.name
            }
            categoryPickerList.push(obj)
          })
          if (id) {
            invoiceDetail()
          } else {
            distinguish(path)
          }
        }
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
      let urlApi = '/projectinvoice/save'
      if (id) {
        urlApi = '/projectinvoice/update'
        params.id = id
      }
      $ajax(urlApi, 'post', params, (res) => {
        mui.toast(res.msg)
        if (res.code === 1) {
          back()
        }
      })
    })

    mui('body').on('tap', '.back, .cancel', () => {
      mui.back()
      // back()
    })
    mui.previewImage();

    // function invoiceUpdate (params) {
    //   $ajax('/projectinvoice/update', 'post', params, function (res) {
    //     console.log(res)
    //   })
    // }
  });
})(mui, document, jQuery);