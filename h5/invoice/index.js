(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    // const pid = 50
    mui('.page-title').on('tap', '#addPhotoShow', function () {
      $('.popup').show()
    })
    mui('body').on('tap', '.opacity-bg', function () {
      $('.popup').hide()
    })
    const pid = JSON.parse(localStorage.getItem('project')).id
    activeSidebar('cost')
    mui('.popup').on('tap', '#addInvoice', function () {
      mui.openWindow({
        url: '/h5/invoice/invoiceDetails.html?invoiceClass=1',
        id: 'invoiceDetails'
      })
      // loadingShow()
      // const file = this.files[0]
      // if (!file.name) {
      //   loadingHide()
      //   mui.toast('upload failed')
      //   return false
      // }
      // const formData = new FormData()
      // formData.append('file', file)
      // console.log(formData)
      // this.value = ''
      // uploadImg(formData, 1)
    })
    mui('.popup').on('tap', '#addExpenses', function () {
      mui.openWindow({
        url: '/h5/invoice/invoiceDetails.html?invoiceClass=2',
        id: 'invoiceDetails'
      })
      // loadingShow()
      // const file = this.files[0]
      // if (!file.name) {
      //   loadingHide()
      //   mui.toast('upload failed')
      //   return false
      // }
      // const formData = new FormData()
      // formData.append('file', file)
      // console.log(formData)
      // this.value = ''
      // uploadImg(formData, 2)
    })
    mui('.popup').on('tap', '#category', function () { 
      mui.openWindow({
        url: '/h5/invoice/category.html',
        id: 'category'
      })
    })

    const page = 1
    const size = 1200
    getProjectInvoiceGgroupList('')
    // invoiceList(page, '')
    getCateGoryList()
    // mui('.page-con').on('tap', '.category-tab', function () {
    //   console.log('this', this)
    //   $('.category-tab span').attr('class', '')
    //   $('.category-tab').attr('class', 'ft-16 text-default category-tab')
    //   this.childNodes[1].className = 'on'
    //   this.className = 'ft-16 f-grey category-tab'
    //   const invoiceType = this.getAttribute('data-val')
    //   invoiceList(page, invoiceType)
    //   getProjectInvoiceGgroupList(invoiceType)
    // })
    
    function getCateGoryList () {
      $ajax(`/projectcategory/list?projectId=${pid}&type=4`, 'get', '', (res) => { 
        let headTemp = '<div class="swiper-slide category-tab" data-val="">All</div>'
        let contentTemp = `<div class="swiper-slide">
        <ul class="invoice-list" id="invoiceList_0"></ul>
      </div>`
        res.data.map((item, index) => { 
          headTemp += `<div class="swiper-slide category-tab" data-val=${item.id}>${item.name}</div>`
          contentTemp += `<div class="swiper-slide">
          <ul class="invoice-list" id="invoiceList_${index+1}"></ul>
        </div>`
        })
        $('#headInvoice').html(headTemp)
        $('#swiperContent').html(contentTemp)
        localStorage.setItem('invoice', JSON.stringify(res.data))
        invoiceList(page, '', 0)
        swiperInit()
      })
    }
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

    function getProjectinvoice (page, invoiceType, idx=0) {
      $ajax('/projectinvoice/list?projectId=' + pid + '&size=' + size + '&page=' + page + '&invoiceType=' + invoiceType, 'get', '', (res) => {
        console.log(res)
        let temp = ''
        const rows = res.data.rows
        let invoiceAmountTotal = 0
        rows.map(item => {
          const createDate = date2Str(new Date(item.createDate))
          // const createDate = iosTimeFormtter(item.createDate)
          console.log(createDate)
          temp += `<li class="border-b-grey invoice-item" data-id="${item.id}">
            <div class="fl invoice-picture"><img src="${imgPath}${item.pic}" /></div>
            <div class="fl flex flex-between invoice-info">
              <div class="line-height-15">
                <p class="ft-12 f-grey">${item.invoiceTypeName}</p>
                <p class="ft-12 text-default">${createDate}</p>
              </div>
              <p class="ft-12 f-grey line-height-30">${item.invoiceAmount}</p>
            </div>
          </li>`
          invoiceAmountTotal += item.invoiceAmount
        })
        $('#invoiceAmountTotal').text('￥' + invoiceAmountTotal.toFixed(2))
        $(`#invoiceList_${idx}`).html(temp)
      })
    }

    mui('#swiperContent').on('tap', '.invoice-item', function () {
      const id = this.getAttribute('data-id')
      mui.openWindow({
        url: '/h5/invoice/invoiceDetails.html?id=' + id,
        id: 'invoiceDetail'
      })
    })

    function uploadImg (formData, invoiceClass) {
      $upload('/upload/fileuploadaws', 'post', formData, (res) => {
        loadingHide()
        if (res.code === 1) {
          console.log(res)
          mui.openWindow({
            url: '/h5/invoice/invoiceDetails.html?url=' + res.data.url + '&invoiceClass='+invoiceClass,
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
    function swiperInit () { 
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      });
      var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: galleryThumbs
        },
        on: {
          slideChange: function() {
            console.log('slideChange', this.activeIndex)
            const idx = this.activeIndex
            const type = $($('.category-tab')[idx]).attr('data-val')
            getProjectinvoice(1, type,  idx)
            getProjectInvoiceGgroupList(type)
          }
        }
      });
    }

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
                    '#B1DCBD', '#48B6E6', '#4081E8', '#5458A6', '#5ae6c6', '#006400', '#F0E68C', '#FFE4C4', '#8B0000', '#FFDAB9'
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