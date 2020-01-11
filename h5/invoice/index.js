(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    // const pid = 50
    // mui('.page-title').on('tap', '#addPhotoShow', function () {
    //   $('.popup').show()
    // })
    // mui('body').on('tap', '.opacity-bg', function () {
    //   $('.popup').hide()
    // })
    const pid = JSON.parse(localStorage.getItem('project')).id
    activeSidebar('cost')
    mui('.relation').on('change', '#addInvoice', function () {
      const file = this.files[0]
      const formData = new FormData()
      formData.append('file', file)
      console.log(formData)
      uploadImg(formData)
    })

    const page = 1
    const size = 12
    getProjectInvoiceGgroupList('')
    invoiceList(page, '')
    mui('.page-con').on('tap', '.category-tab', function () {
      console.log('this', this)
      $('.category-tab span').attr('class', '')
      $('.category-tab').attr('class', 'ft-16 text-default category-tab')
      this.childNodes[1].className = 'on'
      this.className = 'ft-16 f-grey category-tab'
      const invoiceType = this.getAttribute('data-val')
      invoiceList(page, invoiceType)
      getProjectInvoiceGgroupList(invoiceType)
    })


    function invoiceList (page, invoiceType) {
      // window.setupWebViewJavascriptBridge(bridge => {
      //   bridge.callHandler('getProjectId', '', (result) => {
      //     const resData = JSON.parse(result)
      //     pid = resData.projectId
      //     getProjectinvoice(pid)
      //   })
      // })
      getProjectinvoice(page, invoiceType)
    }

    function getProjectinvoice (page, invoiceType) {
      $ajax('/projectinvoice/list?projectId=' + pid + '&size=' + size + '&page=' + page + '&invoiceType=' + invoiceType, 'get', '', (res) => {
        console.log(res)
        let temp = ''
        const rows = res.data.rows
        let invoiceAmountTotal = 0
        const category = {
          2: 'Traffic',
          3: 'Accommodation',
          12: 'Catering',
          13: 'Other'
        }
        rows.map(item => {
          // const createDate = datetime2Str(new Date(item.createDate))
          const createDate = iosTimeFormtter(item.createDate)
          console.log(createDate)
          temp += `<li class="border-b-grey">
            <div class="fl invoice-picture"><img src="${imgPath}${item.pic}" /></div>
            <div class="fl flex flex-between invoice-info">
              <div class="line-height-15">
                <p class="ft-12 f-grey">${category[item.invoiceType]}</p>
                <p class="ft-12 text-default">${createDate}</p>
              </div>
              <p class="ft-12 f-grey line-height-30">${item.invoiceAmount}</p>
            </div>
          </li>`
          invoiceAmountTotal += item.invoiceAmount
        })
        $('#invoiceAmountTotal').text('￥' + invoiceAmountTotal.toFixed(2))
        $('#invoiceList').html(temp)
      })
    }

    function uploadImg (formData) {
      $upload('/upload/fileuploadaws', 'post', formData, (res) => {
        if (res.code === 1) {
          console.log(res)
          mui.openWindow({
            url: '/h5/invoice/invoiceDetails.html?url=' + res.data.url,
            id: 'invoiceDetails'
          })
        }
      })
    }

    function getProjectInvoiceGgroupList (invoiceType) {
      // let pid = null
      // window.setupWebViewJavascriptBridge(bridge => {
      //   bridge.callHandler('getProjectId', '', (result) => {
      //     const resData = JSON.parse(result)
      //     const pid = resData.projectId
      //     // const pid = 52
      //     // getJoinorglist()
      //     getprojectinvoicegrouplistAjax(pid, invoiceType)
      //   })
      // })
      getprojectinvoicegrouplistAjax(pid, invoiceType)
    }
    // getprojectinvoicegrouplistAjax(52, '')
    function getprojectinvoicegrouplistAjax (pid, invoiceType) {
      $ajax('/projectinvoice/getprojectinvoicegrouplist?projectId=' + pid + '&invoiceType=' + invoiceType, 'get', '', (res) => {
        console.log(res)
        echart(res.data)
        let temp = ''
        const colorList = [
          '#B1DCBD', '#48B6E6', '#4081E8', '#5458A6',
        ];
        res.data.map((item, index) => {
          temp += `<li class="flex flex-between">
            <div class="chart-color">
              <span class="chart fl" style="background: ${colorList[index]}"></span>
              <p class="ft-16 f-grey fl">${item.typeName}</p>
            </div>
            <p class="ft-12 text-grey">¥ ${item.amount}</p>
          </li>`
        })
        $('#description').html(temp)
      })
    }

    mui('body').on('tap', '#down', function () {
      html2canvas(document.querySelector("#reportBox")).then(canvas => {
        Canvas2Image.saveAsPNG(canvas)
      });
    })

    function getPixelRatio (context) {
      // 获取设备的PixelRatio
      var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
      return (window.devicePixelRatio || 1) / backingStore;
    }

    function echart (data) {
      const echartData = []
      data.map(item => {
        const obj = {
          value: item.amount,
          name: item.typeName
        }
        echartData.push(obj)
      })
      var myChart = echarts.init(document.getElementById('chart'));
      // 指定图表的配置项和数据
      option = {
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            data: echartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  // 自定义颜色
                  var colorList = [
                    '#B1DCBD', '#48B6E6', '#4081E8', '#5458A6'
                  ];
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option);
    };
  });
})(mui, document, jQuery);