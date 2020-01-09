(function ($$, doc, $) {
  mui.init();
  mui.ready(function () {  
    gettypelist()

    mui('#group').on('tap', '.group-list', function() {
      const isReapeat = $('#addItem li').filter((index, el) => {
        console.log(index)
        return this.attributes['data-name'].value === el.attributes['data-name'].value
      })
      if (isReapeat.length) return false
      const temp = `<li class="border-grey" data-name="${this.attributes['data-name'].value}">
        <div class="flex flex-between align-center">
          <p class="ft-12 text-default ml-05 flex align-center">
            <i class="icon iconfont ft-20 f-E23E3E mr-10">&#xe647;</i>
            <span>${this.attributes['data-name'].value}</span>
          </p>
          <span class="icon iconfont ft-20 text-default mr-10">&#xe665;</span>
        </div>
      </li>`
      this.style.background = '#fbfbfb'
      $('#addItem').append(temp)
    })


    mui('body').on('tap', '#save', function() {
      $('#addItem li').map((index, el) => {
        const params = {
          createUserid: 17,
          name: el.attributes['data-name'].value,
          type: 2,
          projectId: 44
        }
        $ajax('/projectcategory/save', 'post', params, (res) => {
          console.log(res)
        })
      })
    })


    mui('body').on('tap', '#addLabel', function() {
      const val = $('#createLabel').val()
      if ($('#createLabel').val() === '') {
        mui.toast('Please enter content')
        return false
      }
      const temp = `<li class="border-grey" data-name="${val}">
        <div class="flex flex-between align-center">
          <p class="ft-12 text-default ml-05 flex align-center">
            <i class="icon iconfont ft-20 f-E23E3E mr-10">&#xe647;</i>
            <span>${val}</span>
          </p>
          <span class="icon iconfont ft-20 text-default mr-10">&#xe665;</span>
        </div>
      </li>`
      $('#addItem').append(temp)
      $('#createLabel').val('')
    })


    mui('body').on('tap', '#back', () => {
      mui.back()
    })

    function gettypelist() {
      $ajax('/dictionary/gettypelist?code=floorplan_group', 'get', '', (res)=> {
        console.log(res)
        let temp = ''
        res.data.map((item, index) => {
          temp += `<div id="group_${index}"><h1 class="ft-16 f-grey pt-30">${item.dvalue}</h1><ul class="category-list"></ul></div>`
          category(item.id, `group_${index}`)
        })
        $('#group').append(temp)
      })
    }
    function category (pid, id) {
      $ajax('/category/list?type=2&&pid='+pid, 'get', '', (res)=> {
        let temp = ''
        res.data.map((item) => {
          temp += `<li class="border-grey group-list" data-id="${item.id}" data-pid="${item.pid}" data-name="${item.name}">	 
            <i class="icon iconfont ft-20 f-6DB767 mr-10 pl-05 fl">&#xe648;</i>
            <p class="ft-12 text-default ml-05">${item.name}</p>
          </li>`
        })
        $('#'+id+ ' .category-list').append(temp)
      })    
    }
  });
})(mui, document, jQuery);