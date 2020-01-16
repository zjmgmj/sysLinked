(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {
    const userid = Number(localStorage.getItem('userId'))
    const orgId = Number(localStorage.getItem('orgDefault'))
    const id = _get('id')
    if (id) {
      $('.is-setting').css('display', 'block')
      $('.title').text('Project Settings')
      load()
      console.log('id', id)
    }

    function load() {
      $ajax('/project/detail?id=' + id, 'get', '', (res) => {
        console.log(res)
        if (res.code === 1) {
          const resData = res.data
          const fileNoe = document.getElementById('fileShow')
          fileNoe.setAttribute('data', resData.pic)
          fileNoe.setAttribute('src', imgPath + resData.pic)
          fileNoe.style.display = 'block'
          $('#projectName').val(resData.name)
          $('#projectAddress').val(resData.implementationAddress)
          $('#projectCycle').val(resData.cycles)
          $('#startTime span')[0].innerText = iosDateFormtter(resData.startTime)
          $('#endTime span')[0].innerText = iosDateFormtter(resData.endTime)
          if (resData.status === 3) {
            $('#checkedNo i.icon').attr('class', 'icon iconfont iconicon-test36 f-48B6E6')
          } else {
            $('#checkedYes i.icon').attr('class', 'icon iconfont iconicon-test36 f-48B6E6')
            $('#checkedYes').attr('data-val', resData.status)
          }
        }
      })
    }
    const pickButtons = ['cancel', 'sure']
    const nowDate = new Date()
    const endDate = new Date(new Date().getTime() + 604800000)
    $('#startTime span')[0].innerText = date2Str(new Date(nowDate))
    $('#endTime span')[0].innerText = date2Str(new Date(endDate))
    const dayPicker = new $$.DtPicker({
      buttons: pickButtons,
      type: 'date',
      beginYear: 2014,
      endYear: 2129
    })
    mui('.group-input').on('tap', '#startTime', () => {
      dayPicker.setSelectedValue($('#startTime span')[0].innerText.replace(/\//g, '-'));
      dayPicker.show((rs) => {
        $('#startTime span')[0].innerText = rs.text.replace(/-/g, '/');
      });
    });
    mui('.group-input').on('tap', '#endTime', () => {
      dayPicker.setSelectedValue($('#endTime span')[0].innerText.replace(/\//g, '-'));
      dayPicker.show((rs) => {
        $('#endTime span')[0].innerText = rs.text.replace(/-/g, '/');
      });
    });



    mui('.upload').on('change', '#file', () => {
      loadingShow()
      const fileInput = mui('#file')
      const file = fileInput[0].files[0];
      const formData = new FormData();
      formData.append('file', file)
      $upload('/upload/fileuploadaws', 'post', formData, (res) => {
        console.log('res', res)
        loadingHide()
        if (res.code === 1) {
          const fileNoe = document.getElementById('fileShow')
          fileNoe.setAttribute('data', res.data.url)
          fileNoe.setAttribute('src', imgPath + res.data.smallUrl)
          fileNoe.style.display = 'block'
        }
      })
    })

    mui('body').on('tap', '.submit', () => {
      if (!$('#projectName').val()) {
        mui.toast('Please Enter Modify Project Name')
        return false
      }
      if (!$('#projectAddress').val()) {
        mui.toast('Please Enter Address')
        return false
      }
      if (!$('#startTime span')[0].innerText) {
        mui.toast('Please Enter Starting Time')
        return false
      }
      if (!$('#endTime span')[0].innerText) {
        mui.toast('Please Enter End Time')
        return false
      }
      const params = {
        // id: Number(id),
        createUserid: userid,
        orgId: orgId,
        cycles: $('#projectCycle').val(),
        implementationAddress: $('#projectAddress').val(),
        name: $('#projectName').val(),
        pic: $('#fileShow').attr('data'),
        startTime: $('#startTime span')[0].innerText,
        endTime: $('#endTime span')[0].innerText
      }
      let urlApi = '/project/save'
      if (id) {
        urlApi = '/project/update'
        params.status = Number($('.iconicon-test36.f-48B6E6').parent().attr('data-val'))
      }
      $ajax(urlApi, 'post', params, (res) => {
        console.log('---------', res)
        mui.toast(res.msg)
        if (res.code === 1) {
          // mui.back()
          setTimeout(() => {
            mui.openWindow({
              url: '/h5/zh/',
              id: 'home'
            })
          }, 800)
        }
      })
    })

    mui('body').on('tap', '.cancel', () => {
      mui.back()
    })

    mui('body').on('tap', '#checkedNo', function () {
      if ($('#checkedNo i.icon').hasClass('iconicon-test36')) {
        $('#checkedNo i.icon').removeClass('iconicon-test36 f-48B6E6').addClass('iconicon-test37 text-default')
        $('#checkedYes i.icon').removeClass('iconicon-test37 text-default').addClass('iconicon-test36 f-48B6E6')
      } else {
        $('#checkedNo i.icon').removeClass('iconicon-test37 text-default').addClass('iconicon-test36 f-48B6E6')
        $('#checkedYes i.icon').removeClass('iconicon-test36 f-48B6E6').addClass('iconicon-test37 text-default')
      }
    })
    mui('body').on('tap', '#checkedYes', function () {
      if ($('#checkedYes i.icon').hasClass('iconicon-test36')) {
        $('#checkedNo i.icon').removeClass('iconicon-test37 text-default').addClass('iconicon-test36 f-48B6E6')
        $('#checkedYes i.icon').removeClass('iconicon-test36 f-48B6E6').addClass('iconicon-test37 text-default')
      } else {
        $('#checkedNo i.icon').removeClass('iconicon-test36 f-48B6E6').addClass('iconicon-test37 text-default')
        $('#checkedYes i.icon').removeClass('iconicon-test37 text-default').addClass('iconicon-test36 f-48B6E6')
      }
    })
  });

})(mui, document, jQuery);