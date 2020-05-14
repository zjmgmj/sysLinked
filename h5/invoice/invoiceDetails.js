(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const url = 'https://alieneye.s3.cn-northwest-1.amazonaws.com.cn/'
    
    let path = $('#addInvoice').attr('data-path') || getUrlParam('url')
    const id = getUrlParam('id')
    const invoiceClass = getUrlParam('invoiceClass') // 1发票 2收据
    const pid = JSON.parse(localStorage.getItem('project')).id
    const categoryPickerList = []
    categoryList()
    if (invoiceClass == 1) {
      $('#title').text('Invoice Details')
      $('#picturesTitle').text('Replace pictures')
    } else { 
      $('#title').text('Fill In The Cost')
      $('#picturesTitle').text('Add pictures')
    }
    
    const pickButtons = ['cancel', 'sure']
    const nowDate = new Date()
    // const endDate = new Date(new Date().getTime() + 604800000)
    $('#receiptContent #invoiceDate').text(date2Str(new Date(nowDate)))
    const dayPicker = new $$.DtPicker({
      buttons: pickButtons,
      type: 'date',
      beginYear: 2014,
      endYear: 2129
    })
    mui('#receiptContent').on('tap', '#receiptContent #invoiceDate', () => {
      dayPicker.setSelectedValue($('#receiptContent #invoiceDate').text().replace(/\//g, '-'));
      dayPicker.show((rs) => {
        $('#receiptContent #invoiceDate').text(rs.text.replace(/-/g, '/'))
      });
    });

    function invoiceDetail() {
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


    function distinguish(path) {
      loadingShow()
      $ajax('/projectinvoice/distinguish?url=' + url + path, 'get', '', (res) => {
        if (res.code === 1) {
          const resData = res.data
          $('#invoice-pic')[0].src = url + path
          $('#invoice-pic').attr('data-path', path)
          $('#invoiceDate').text(resData.invoiceDate || '')
          $('#invoiceCode').text(resData.invoiceCode || '')
          $('#invoiceNum').text(resData.invoiceNum || '')
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

    // const pickButtons = ['cancel', 'sure']
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
      if (invoiceClass === '2') {
        $('#invoiceContent').hide()
        $('#receiptContent').show()
      }
      $ajax(`/projectcategory/list?projectId=${pid}&type=4`, 'get', '', (res) => {
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
          }
          else if (invoiceClass === '1') {
            distinguish(path)
          }
          // else { 
          //   $('#invoice-pic')[0].src = url + path
          //   $('#invoice-pic').attr('data-path', path)
          // }
        }
        categoryPicker.setData(categoryPickerList)
      })
    }

    mui('body').on('tap', '.submit', function () {
      if (!$('#category').attr('data-val')) {
        mui.toast('Please select an invoice type')
        return false
      }
      let params = {}
      if (invoiceClass === '1') {
        params = {
          invoiceClass: invoiceClass,
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
          type: $('#category span').text()
        }
      } else {
        const invoiceAmount = $('#receiptContent #invoiceAmount')[0].value
        if (!invoiceAmount) {
          mui.toast('Please enter the amount')
          return false
        }
        const invoiceDate = $('#receiptContent #invoiceDate').text()
        if (!invoiceDate) {
          mui.toast('Please select time')
          return false
        }
        params = {
          invoiceClass: invoiceClass,
          // draweeName
          // amountExtax: $('#receiptContent #amountExtax').text(),
          // checkCode: $('#verifiyCode').val(),
          // "createDate": "2019-12-19T11:11:14.193Z",
          createUserid: Number(localStorage.getItem('userId')),
          draweeAddphone: $('#receiptContent #draweeAddphone').text(),
          draweeBankaccount: $('#receiptContent #draweeBankaccount').text(),
          draweeName: $('#receiptContent #draweeName').text(),
          draweeTaxno: $('#receiptContent #draweeTaxno').text(),
          invoiceAmount: Number($('#receiptContent #invoiceAmount')[0].value),
          // invoiceCode: $('#invoiceCode').text(),
          invoiceDate: $('#receiptContent #invoiceDate').text(),
          remarks: $('#receiptContent #remarks')[0].value,
          // invoiceNum: $('#invoiceNum').text(),
          // invoiceTax: $('#invoiceTax').text(),
          invoiceType: Number($('#category').attr('data-val')),
          pic: $('#invoice-pic').attr('data-path'),
          projectId: Number(JSON.parse(localStorage.getItem('project')).id),
          sellerAddphone: $('#receiptContent #sellerAddphone').text(),
          sellerBankaccount: $('#receiptContent #sellerBankaccount').text(),
          sellerName: $('#receiptContent #sellerName').text(),
          sellerTax: $('#receiptContent #sellerTax').text(),
          type: $('#category').text()
        }
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
      // mui.back()
      back()
    })
    
    
    mui('body').on('change', '#addInvoice', function () {
      loadingShow()
      const file = this.files[0]
      const formData = new FormData()
      formData.append('file', file)
      console.log(formData)
      uploadImg(formData, invoiceClass)
    })
    function uploadImg (formData, invoiceClass) {
      $upload('/upload/fileuploadaws', 'post', formData, (res) => {
        loadingHide()
        if (res.code === 1) {
          path = res.data.url
          $('#addInvoice').attr('data-path', res.data.url)
          $('#picturesTitle').text('Replace pictures')
          if (invoiceClass == '1') {
            distinguish(path)
          } else { 
            $('#invoice-pic')[0].src = url + path
            $('#invoice-pic').attr('data-path', path)
          }
        }
      })
    }
    // function invoiceUpdate (params) {
    //   $ajax('/projectinvoice/update', 'post', params, function (res) {
    //     console.log(res)
    //   })
    // }
    mui('body').on('tap', '#invoice-pic', () => {
      if ($('#invoice-pic').attr('data-path')) {
        mui.previewImage();
      }
    })
  });
})(mui, document, jQuery);